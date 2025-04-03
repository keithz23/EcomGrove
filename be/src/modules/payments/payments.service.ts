import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import axios from 'axios';
import { PaymentProps } from 'src/common/types/payments/payment';
import { PrismaService } from 'src/database/prisma/prisma.service';

@Injectable()
export class PaymentsService {
  constructor(private readonly prismaService: PrismaService) {}
  private readonly clientId = process.env.PAYPAL_CLIENT_ID;
  private readonly secret = process.env.PAYPAL_SECRET;
  private readonly apiUrl = process.env.PAYPAL_API;

  async generateAccessToken(): Promise<string> {
    const auth = Buffer.from(`${this.clientId}:${this.secret}`).toString(
      'base64',
    );

    try {
      const response = await axios.post(
        `${this.apiUrl}/v1/oauth2/token`,
        'grant_type=client_credentials',
        {
          headers: {
            Authorization: `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );

      return response.data.access_token;
    } catch (error) {
      console.error(
        'PayPal token error:',
        error.response?.data || error.message,
      );
      throw new HttpException(
        'Unable to fetch PayPal token',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async captureOrder(orderId: string): Promise<any> {
    const accessToken = await this.generateAccessToken();
    try {
      const response = await axios.post(
        `${this.apiUrl}/v2/checkout/orders/${orderId}/capture`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        },
      );

      return response.data;
    } catch (error) {
      console.error(
        'PayPal capture error:',
        error.response?.data || error.message,
      );
      throw new HttpException(
        error.response?.data || 'Error capturing PayPal order',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getOrderDetails(orderId: string): Promise<any> {
    const accessToken = await this.generateAccessToken();
    try {
      const response = await axios.get(
        `${this.apiUrl}/v2/checkout/orders/${orderId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        },
      );

      return response.data;
    } catch (error) {
      console.error(
        'PayPal get order error:',
        error.response?.data || error.message,
      );
      throw new HttpException(
        error.response?.data || 'Error getting PayPal order details',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async saveOrderDetails(orderId: string, userEmail: string) {
    try {
      const orderDetailsData = await this.getOrderDetails(orderId);

      const existingUser = await this.prismaService.user.findUnique({
        where: { email: userEmail },
      });

      if (!existingUser) {
        return {
          statusCode: 400,
          success: false,
          message: 'User not found',
        };
      }

      // Validate required fields from PayPal response
      if (!orderDetailsData?.purchase_units?.[0] || !orderDetailsData?.payer) {
        throw new HttpException(
          'Invalid order details from PayPal',
          HttpStatus.BAD_REQUEST,
        );
      }

      const payload: PaymentProps = {
        amount: {
          value: orderDetailsData.purchase_units[0].amount.value,
          currencyCode: orderDetailsData.purchase_units[0].amount.currency_code,
        },
        payer: {
          payerId: orderDetailsData.payer.payer_id,
          email: orderDetailsData.payer.email_address,
          name: {
            givenName: orderDetailsData.payer.name.given_name,
            surName: orderDetailsData.payer.name.surname,
          },
        },
        method: 'PayPal',
        address: orderDetailsData.shipping?.address
          ? {
              addressLine1: orderDetailsData.shipping.address.address_line_1,
              countryCode: orderDetailsData.shipping.address.country_code,
              postalCode: orderDetailsData.shipping.address.postal_code,
            }
          : null,
      };

      const savePayments = await this.prismaService.payment.create({
        data: {
          amount: JSON.stringify(payload.amount),
          payer: JSON.stringify(payload.payer),
          method: payload.method,
          address: JSON.stringify(payload.address),
          status: 'COMPLETED',
          transactionId: orderDetailsData.id,
          order: {
            connect: { id: 1 },
          },
          user: {
            connect: { id: existingUser.id },
          },
        },
      });

      return {
        statusCode: 201,
        success: true,
        message: 'Payment saved successfully',
        data: savePayments,
      };
    } catch (error) {
      console.error('Error while saving data to database:', error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        error.message || 'Error while saving data to database',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findAll(userEmail: string, page: number = 1, limit: number = 10) {
    const existingUser = await this.prismaService.user.findUnique({
      where: { email: userEmail },
    });
    try {
      const skip = (page - 1) * limit;
      const [paymentData, total] = await Promise.all([
        this.prismaService.payment.findMany({
          where: { userId: existingUser.id },
          skip,
          take: limit,
        }),
        this.prismaService.payment.count(),
      ]);

      const formattedPaymentData = paymentData.map((payment) => ({
        ...payment,
        amount: JSON.parse(payment.amount as string),
        payer: JSON.parse(payment.payer as string),
        address: payment.address ? JSON.parse(payment.address as string) : null,
      }));

      return {
        statusCode: 200,
        message: 'Fetched payment data successfully',
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        data: formattedPaymentData,
      };
    } catch (error: any) {
      console.error('Error while fetching all payments data', error.message);
      throw new InternalServerErrorException();
    }
  }

  async findOneById(userEmail: string, paymentId: number) {
    try {
      const existingUser = await this.prismaService.user.findUnique({
        where: { email: userEmail },
      });

      if (!existingUser) {
        return {
          statusCode: 400,
          success: false,
          message: 'User not found',
        };
      }

      const paymentData = await this.prismaService.payment.findUnique({
        where: { userId: existingUser.id, id: paymentId },
      });

      if (!paymentData) {
        return {
          statusCode: 404,
          success: false,
          message: 'Payment not found',
        };
      }

      const safeParse = (data: any) => {
        try {
          return data ? JSON.parse(data) : null;
        } catch (error) {
          console.error('Error parsing JSON:', error.message);
          return null;
        }
      };

      const formattedPaymentData = {
        ...paymentData,
        amount: safeParse(paymentData.amount as string),
        payer: safeParse(paymentData.payer as string),
        address: paymentData.address
          ? safeParse(paymentData.address as string)
          : null,
      };

      return {
        statusCode: 200,
        message: 'Fetched payment data successfully',
        data: formattedPaymentData,
      };
    } catch (error: any) {
      console.error('Error while fetching payment data', error.message);
      throw new InternalServerErrorException(error.message);
    }
  }
}
