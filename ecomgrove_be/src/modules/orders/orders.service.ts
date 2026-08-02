import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, createOrderDto: CreateOrderDto) {
    const cartItems = await this.prisma.cart.findMany({
      where: { userId },
      include: { product: true },
      orderBy: { createdAt: 'asc' },
    });

    if (cartItems.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    const total = cartItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0,
    );

    return this.prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          userId,
          status: 'PENDING',
          total,
          note: createOrderDto.note,
          address: createOrderDto.address,
          items: {
            create: cartItems.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.product.price,
            })),
          },
        },
        include: {
          items: {
            include: { product: true },
          },
        },
      });

      await tx.cart.deleteMany({ where: { userId } });

      return order;
    });
  }

  findAll(userId: string) {
    return this.prisma.order.findMany({
      where: { userId },
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(userId: string, id: string) {
    const order = await this.prisma.order.findFirst({
      where: { id, userId },
      include: { items: { include: { product: true } } },
    });

    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async update(userId: string, id: string, updateOrderDto: UpdateOrderDto) {
    await this.findOne(userId, id);

    return this.prisma.order.update({
      where: { id },
      data: {
        note: updateOrderDto.note,
        address: updateOrderDto.address,
      },
      include: { items: { include: { product: true } } },
    });
  }

  async remove(userId: string, id: string) {
    await this.findOne(userId, id);

    return this.prisma.$transaction(async (tx) => {
      await tx.orderItem.deleteMany({ where: { orderId: id } });
      return tx.order.delete({
        where: { id },
      });
    });
  }
}
