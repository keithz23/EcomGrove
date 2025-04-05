import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import axios from 'axios';
import { PrismaService } from 'src/database/prisma/prisma.service';

@Injectable()
export class OrdersService {
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
            'Content-Type': 'application/x-www-urlencoded',
          },
        },
      );

      return response.data.access_token;
    } catch (error) {
      console.error(
        'Paypal token error:',
        error.response?.data || error.message,
      );
      throw new HttpException(
        'Unable to fetch Paypal token',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getOrderDetails(orderId: string): Promise<string> {
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
    }
  }

  async create(userEmail: string) {
    try {
      return await this.prismaService.$transaction(async (prisma) => {
        const user = await prisma.user.findUnique({
          where: { email: userEmail },
        });

        if (!user) {
          return {
            success: false,
            statusCode: 400,
            message: 'User not found',
          };
        }

        const cartItems = await prisma.cart.findMany({
          where: { userId: user.id },
          include: {
            product: true,
            user: true,
          },
        });

        if (cartItems.length === 0) {
          return {
            success: false,
            statusCode: 400,
            message: 'Cart is empty for the user',
          };
        }

        const orders = [];

        for (const cartItem of cartItems) {
          const productData = await prisma.product.findUnique({
            where: { id: cartItem.productId },
          });

          if (!productData) {
            return {
              success: false,
              statusCode: 400,
              message: `Product with ID ${cartItem.productId} not found`,
            };
          }

          const totalAmount = productData.price.toNumber() * cartItem.quantity;

          const order = await prisma.order.create({
            data: {
              quantity: cartItem.quantity,
              productId: cartItem.productId,
              totalAmount,
              userId: cartItem.user.id,
            },  
          });

          await prisma.product.update({
            where: { id: cartItem.productId },
            data: {
              stock: {
                decrement: cartItem.quantity,
              },
            },
          });

          orders.push(order);
        }

        await prisma.cart.deleteMany({
          where: { userId: user.id },
        });

        return {
          success: true,
          statusCode: 201,
          message: 'Orders created successfully',
          data: orders,
        };
      });
    } catch (err: any) {
      console.error('Error while creating new orders:', err);
      throw new InternalServerErrorException();
    }
  }

  async findAll(userEmail: string, page: number = 1, limit: number = 10) {
    const existingUser = await this.prismaService.user.findUnique({
      where: { email: userEmail },
    });
    try {
      const skip = (page - 1) * limit;
      const [orderData, total] = await Promise.all([
        this.prismaService.order.findMany({
          where: { id: existingUser.id },
          skip,
          take: limit,
        }),
        this.prismaService.order.count(),
      ]);

      return {
        success: true,
        statusCode: 200,
        message: 'Fetched order data successfully',
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        data: orderData,
      };
    } catch (err: any) {
      console.error('Error while fetching all orders data', err.message);
      throw new InternalServerErrorException();
    }
  }

  async findOne(orderId: number, userEmail: string) {
    try {
      const user = await this.prismaService.user.findUnique({
        where: { email: userEmail },
      });
      const order = await this.prismaService.order.findFirst({
        where: { id: orderId, userId: user.id },
      });

      if (!order) {
        return {
          success: false,
          statusCode: 400,
          message: 'Order not found',
        };
      }

      if (!user) {
        return {
          success: false,
          statusCode: 400,
          message: 'User not found',
        };
      }

      return {
        success: true,
        statusCode: 200,
        message: 'Fetched order successfully',
        data: order,
      };
    } catch (err: any) {
      console.error('Error while fetching the order', err.message);
      throw new InternalServerErrorException();
    }
  }

  async cancelOrder(orderId: number, userEmail: string) {
    try {
      const user = await this.prismaService.user.findUnique({
        where: { email: userEmail },
      });

      const order = await this.prismaService.order.findUnique({
        where: { id: orderId },
      });

      if (!order) {
        return {
          success: false,
          statusCode: 400,
          message: 'Order not found',
        };
      }

      if (!user) {
        return {
          success: false,
          statusCode: 400,
          message: 'User not found',
        };
      }

      if (order.userId !== user.id) {
        return {
          success: false,
          statusCode: 400,
          message: 'You are not allowed to cancel this order',
        };
      }

      if (order.status === 'SHIPPED') {
        return {
          success: false,
          statusCode: 403,
          message: 'Cannot cancel an order that has already been shipped',
        };
      }

      const canceledOrder = await this.prismaService.order.update({
        where: { id: orderId },
        data: { status: 'CANCELLED' },
      });

      return {
        success: true,
        statusCode: 200,
        message: 'Order cancelled successfully',
        data: canceledOrder,
      };
    } catch (error) {
      console.error(
        `Failed to cancel order ${orderId} for user ${userEmail}`,
        error,
      );
      throw new InternalServerErrorException();
    }
  }
}
