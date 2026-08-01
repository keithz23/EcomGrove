import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import {
  PaymentProvider,
  PaymentStatus,
  Prisma,
  ReconciliationResult,
  WebhookEventStatus,
} from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { createHash } from 'crypto';
import Stripe = require('stripe');
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { canTransitionPayment } from './payment-status';

type PaymentWithAttempts = Prisma.PaymentIntentGetPayload<{
  include: { attempts: true };
}>;

@Injectable()
export class PaymentsService {
  private readonly stripe: Stripe;

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {
    this.stripe = new Stripe(
      this.configService.getOrThrow<string>('config.stripe.secretKey'),
    );
  }

  async create(userId: string, dto: CreatePaymentDto) {
    const existingPayment = await this.prisma.paymentIntent.findUnique({
      where: {
        userId_idempotencyKey: {
          userId,
          idempotencyKey: dto.idempotencyKey,
        },
      },
      include: { attempts: { orderBy: { attemptNo: 'desc' }, take: 1 } },
    });
    if (existingPayment) return this.toPaymentResponse(existingPayment);

    const order = await this.prisma.order.findFirst({
      where: { id: dto.orderId, userId },
    });
    if (!order) throw new NotFoundException('Order not found');

    const amount = Math.round(order.total);
    if (!Number.isSafeInteger(amount) || amount <= 0) {
      throw new BadRequestException('Order total is not payable');
    }

    let payment: PaymentWithAttempts;
    try {
      payment = await this.prisma.$transaction(async (tx) => {
        const created = await tx.paymentIntent.create({
          data: {
            orderId: order.id,
            userId,
            amount,
            currency: this.configService.getOrThrow<string>(
              'config.stripe.currency',
            ),
            provider: PaymentProvider.STRIPE,
            idempotencyKey: dto.idempotencyKey,
            events: {
              create: {
                eventName: 'PAYMENT_CREATED',
                toStatus: PaymentStatus.PENDING,
              },
            },
          },
          include: { attempts: true },
        });
        return created;
      });
    } catch (error) {
      if (this.isUniqueConstraintError(error)) {
        const duplicate = await this.prisma.paymentIntent.findUniqueOrThrow({
          where: {
            userId_idempotencyKey: {
              userId,
              idempotencyKey: dto.idempotencyKey,
            },
          },
          include: { attempts: { orderBy: { attemptNo: 'desc' }, take: 1 } },
        });
        return this.toPaymentResponse(duplicate);
      }
      throw error;
    }

    try {
      const session = await this.stripe.checkout.sessions.create(
        {
          mode: 'payment',
          client_reference_id: payment.id,
          success_url: `${this.configService.getOrThrow<string>('config.stripe.successUrl')}?payment_intent_id=${payment.id}&session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${this.configService.getOrThrow<string>('config.stripe.cancelUrl')}?payment_intent_id=${payment.id}`,
          metadata: { paymentIntentId: payment.id, orderId: order.id, userId },
          payment_intent_data: {
            metadata: { paymentIntentId: payment.id, orderId: order.id },
          },
          line_items: [
            {
              price_data: {
                currency: payment.currency,
                product_data: { name: `Order ${order.id}` },
                unit_amount: payment.amount,
              },
              quantity: 1,
            },
          ],
        },
        { idempotencyKey: payment.id },
      );

      if (!session.url) {
        throw new InternalServerErrorException(
          'Stripe did not return a checkout URL',
        );
      }

      const updated = await this.prisma.paymentIntent.update({
        where: { id: payment.id },
        data: {
          providerCheckoutSessionId: session.id,
          providerPaymentIntentId:
            typeof session.payment_intent === 'string'
              ? session.payment_intent
              : null,
          attempts: {
            create: {
              attemptNo: 1,
              providerSessionId: session.id,
              checkoutUrl: session.url,
            },
          },
          events: {
            create: {
              eventName: 'STRIPE_CHECKOUT_SESSION_CREATED',
              fromStatus: PaymentStatus.PENDING,
              toStatus: PaymentStatus.PENDING,
              metadata: { checkoutSessionId: session.id },
            },
          },
        },
        include: { attempts: { orderBy: { attemptNo: 'desc' }, take: 1 } },
      });
      return this.toPaymentResponse(updated);
    } catch (error) {
      await this.prisma.paymentEvent.create({
        data: {
          paymentIntentId: payment.id,
          eventName: 'STRIPE_SESSION_CREATION_UNKNOWN',
          fromStatus: PaymentStatus.PENDING,
          toStatus: PaymentStatus.PENDING,
          metadata: { reason: this.errorMessage(error) },
        },
      });
      throw new InternalServerErrorException(
        'Unable to start checkout. The payment remains pending; retry with the same idempotency key.',
      );
    }
  }

  async findOne(userId: string, paymentIntentId: string) {
    const payment = await this.prisma.paymentIntent.findFirst({
      where: { id: paymentIntentId, userId },
      include: { attempts: { orderBy: { attemptNo: 'desc' }, take: 1 } },
    });
    if (!payment) throw new NotFoundException('Payment not found');
    return this.toPaymentResponse(payment);
  }

  constructWebhookEvent(payload: Buffer, signature: string): Stripe.Event {
    return this.stripe.webhooks.constructEvent(
      payload,
      signature,
      this.configService.getOrThrow<string>('config.stripe.webhookSecret'),
    );
  }

  async processWebhook(event: Stripe.Event, rawPayload: Buffer) {
    try {
      await this.prisma.webhookEvent.create({
        data: {
          provider: PaymentProvider.STRIPE,
          providerEventId: event.id,
          eventType: event.type,
          payloadHash: createHash('sha256').update(rawPayload).digest('hex'),
        },
      });
    } catch (error) {
      if (this.isUniqueConstraintError(error))
        return { received: true, duplicate: true };
      throw error;
    }

    try {
      const paymentIntentId = await this.resolvePaymentIntentId(event);
      if (!paymentIntentId) {
        await this.markWebhook(event.id, WebhookEventStatus.IGNORED);
        return { received: true, ignored: true };
      }

      const transition = this.statusForEvent(event);
      if (transition) {
        await this.transitionPayment(paymentIntentId, transition, event.type, {
          stripeEventId: event.id,
        });
      }

      await this.markWebhook(event.id, WebhookEventStatus.PROCESSED);
      return { received: true };
    } catch (error) {
      await this.markWebhook(event.id, WebhookEventStatus.FAILED);
      throw error;
    }
  }

  async reconcilePendingPayments(limit = 100) {
    const pendingPayments = await this.prisma.paymentIntent.findMany({
      where: {
        provider: PaymentProvider.STRIPE,
        status: PaymentStatus.PENDING,
        providerCheckoutSessionId: { not: null },
      },
      take: Math.min(limit, 100),
      orderBy: { createdAt: 'asc' },
    });

    for (const payment of pendingPayments) {
      const session = await this.stripe.checkout.sessions.retrieve(
        payment.providerCheckoutSessionId!,
      );
      const providerStatus = session.payment_status;
      const targetStatus =
        providerStatus === 'paid'
          ? PaymentStatus.SUCCEEDED
          : session.status === 'expired'
            ? PaymentStatus.EXPIRED
            : PaymentStatus.PENDING;

      if (targetStatus !== PaymentStatus.PENDING) {
        await this.transitionPayment(
          payment.id,
          targetStatus,
          'RECONCILIATION',
          {
            stripeCheckoutSessionId: session.id,
            paymentStatus: providerStatus,
          },
        );
      }

      await this.prisma.reconciliationRecord.create({
        data: {
          paymentIntentId: payment.id,
          providerReference: session.id,
          internalStatus: targetStatus,
          providerStatus,
          result:
            targetStatus === payment.status
              ? ReconciliationResult.MATCHED
              : ReconciliationResult.STATUS_MISMATCH,
        },
      });
    }

    return { reconciled: pendingPayments.length };
  }

  private async resolvePaymentIntentId(event: Stripe.Event) {
    const object = event.data.object as
      | Stripe.Checkout.Session
      | Stripe.PaymentIntent;
    const metadataPaymentIntentId = object.metadata?.paymentIntentId;
    if (metadataPaymentIntentId) return metadataPaymentIntentId;

    if (object.object === 'checkout.session') {
      const payment = await this.prisma.paymentIntent.findUnique({
        where: { providerCheckoutSessionId: object.id },
      });
      return payment?.id;
    }

    if (object.object === 'payment_intent') {
      const payment = await this.prisma.paymentIntent.findUnique({
        where: { providerPaymentIntentId: object.id },
      });
      return payment?.id;
    }

    return undefined;
  }

  private statusForEvent(event: Stripe.Event): PaymentStatus | undefined {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        return session.payment_status === 'paid'
          ? PaymentStatus.SUCCEEDED
          : PaymentStatus.PENDING;
      }
      case 'checkout.session.async_payment_succeeded':
        return PaymentStatus.SUCCEEDED;
      case 'checkout.session.async_payment_failed':
      case 'payment_intent.payment_failed':
        return PaymentStatus.FAILED;
      case 'checkout.session.expired':
        return PaymentStatus.EXPIRED;
      default:
        return undefined;
    }
  }

  private async transitionPayment(
    paymentIntentId: string,
    toStatus: PaymentStatus,
    eventName: string,
    metadata: Prisma.InputJsonValue,
  ) {
    await this.prisma.$transaction(async (tx) => {
      const payment = await tx.paymentIntent.findUniqueOrThrow({
        where: { id: paymentIntentId },
      });

      if (!canTransitionPayment(payment.status, toStatus)) {
        await tx.paymentEvent.create({
          data: {
            paymentIntentId,
            eventName: 'INVALID_PAYMENT_TRANSITION',
            fromStatus: payment.status,
            toStatus,
            metadata,
          },
        });
        return;
      }

      if (payment.status === toStatus) return;

      await tx.paymentIntent.update({
        where: { id: paymentIntentId },
        data: { status: toStatus },
      });
      await tx.paymentAttempt.updateMany({
        where: { paymentIntentId, status: PaymentStatus.PENDING },
        data: { status: toStatus },
      });
      await tx.paymentEvent.create({
        data: {
          paymentIntentId,
          eventName,
          fromStatus: payment.status,
          toStatus,
          metadata,
        },
      });

      if (toStatus === PaymentStatus.SUCCEEDED) {
        await tx.order.update({
          where: { id: payment.orderId },
          data: { status: 'PAID' },
        });
      }
    });
  }

  private async markWebhook(eventId: string, status: WebhookEventStatus) {
    await this.prisma.webhookEvent.update({
      where: { providerEventId: eventId },
      data: { status, processedAt: new Date() },
    });
  }

  private toPaymentResponse(payment: PaymentWithAttempts) {
    const attempt = payment.attempts[0];
    return {
      paymentIntentId: payment.id,
      orderId: payment.orderId,
      status: payment.status,
      provider: payment.provider,
      providerCheckoutSessionId: payment.providerCheckoutSessionId,
      checkoutUrl: attempt?.checkoutUrl ?? null,
    };
  }

  private isUniqueConstraintError(error: unknown) {
    return (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    );
  }

  private errorMessage(error: unknown) {
    return error instanceof Error ? error.message : 'Unknown provider error';
  }
}
