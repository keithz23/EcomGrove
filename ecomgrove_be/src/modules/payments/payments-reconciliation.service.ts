import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PaymentsService } from './payments.service';

@Injectable()
export class PaymentsReconciliationService {
  private readonly logger = new Logger(PaymentsReconciliationService.name);

  constructor(private readonly paymentsService: PaymentsService) {}

  @Cron(CronExpression.EVERY_10_MINUTES)
  async reconcilePendingPayments() {
    try {
      const { reconciled } =
        await this.paymentsService.reconcilePendingPayments();
      if (reconciled > 0) {
        this.logger.log(`Reconciled ${reconciled} pending Stripe payment(s)`);
      }
    } catch (error) {
      this.logger.error(
        'Stripe payment reconciliation failed',
        error instanceof Error ? error.stack : undefined,
      );
    }
  }
}
