import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { CombinedAuthGuard } from '../auth/guards/combined.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  @UseGuards(CombinedAuthGuard)
  create(@Body() dto: CreatePaymentDto, @Req() req: Request) {
    return this.paymentsService.create((req as any).user.sub, dto);
  }

  @Get(':id')
  @UseGuards(CombinedAuthGuard)
  findOne(@Param('id') id: string, @Req() req: Request) {
    return this.paymentsService.findOne((req as any).user.sub, id);
  }

  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  async webhook(
    @Req() req: Request,
    @Headers('stripe-signature') signature?: string,
  ) {
    if (!signature || !Buffer.isBuffer(req.body)) {
      throw new BadRequestException('Missing Stripe signature or raw body');
    }
    const event = this.paymentsService.constructWebhookEvent(
      req.body,
      signature,
    );
    return this.paymentsService.processWebhook(event, req.body);
  }

  @Post('reconcile')
  @UseGuards(CombinedAuthGuard, PermissionsGuard)
  @Permissions('order:update')
  reconcile() {
    return this.paymentsService.reconcilePendingPayments();
  }
}
