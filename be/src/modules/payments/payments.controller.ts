import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { Request, Response } from 'express';
import { JwtPaymentsGuard } from './jwt-payments.guard';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('capture/:orderId')
  @HttpCode(200)
  async capturePayment(@Param('orderId') orderId: string) {
    return await this.paymentsService.captureOrder(orderId);
  }

  @Post('details/:orderId')
  @HttpCode(200)
  async getOrderDetails(@Param('orderId') orderId: string) {
    return await this.paymentsService.getOrderDetails(orderId);
  }

  @UseGuards(JwtPaymentsGuard)
  @Post('save-payments/:orderId')
  @HttpCode(200)
  async saveOrderDetails(
    @Param('orderId') orderId: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const userEmail = (req.user as any).email;
    try {
      const response = await this.paymentsService.saveOrderDetails(
        orderId,
        userEmail,
      );

      if (!response.success) {
        return res.status(400).json({
          statusCode: 400,
          message: response.message,
        });
      }

      return res.status(201).json(response);
    } catch (error) {
      return res.status(500).json({
        success: false,
        statusCode: 500,
        message: 'Interal Server Error',
      });
    }
  }
}
