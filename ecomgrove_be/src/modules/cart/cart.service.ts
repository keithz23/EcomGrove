import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateCartDto } from './dto/update-cart.dto';

@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) {}
  async getCartByUser(userId: string) {
    try {
      const cartItems = await this.prisma.cart.findMany({
        where: { userId },
        include: {
          product: true,
        },
      });

      return cartItems;
    } catch (error) {
      console.error('Error while getting cart by user:', error);
      throw new InternalServerErrorException(
        'An unexpected error occurred while fetching cart',
      );
    }
  }

  async addToCart(addToCartDto: AddToCartDto, userId: string) {
    const { quantity, productId } = addToCartDto;

    try {
      return await this.prisma.$transaction(async (prisma) => {
        // 1. Check user
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) throw new NotFoundException('User not found');

        // 2. Check product
        const product = await prisma.product.findUnique({
          where: { id: productId },
        });
        if (!product)
          throw new NotFoundException(`Product ${productId} not found`);

        // 3. Check if cart item exists
        const cartItem = await prisma.cart.findFirst({
          where: { userId, productId },
        });

        if (cartItem) {
          const newTotalQuantity = cartItem.quantity + quantity;

          // 4. Check if new total exceeds stock
          if (newTotalQuantity > product.stock) {
            throw new BadRequestException(
              `Only ${product.stock} item(s) left in stock`,
            );
          }

          // 5. Update cart & reduce stock
          await prisma.cart.update({
            where: { id: cartItem.id },
            data: {
              quantity: newTotalQuantity,
            },
          });

          await prisma.product.update({
            where: { id: productId },
            data: {
              stock: {
                decrement: quantity,
              },
            },
          });

          return { message: 'Cart updated' };
        }

        // 6. If not exists, ensure enough stock
        if (quantity > product.stock) {
          throw new BadRequestException(
            `Only ${product.stock} item(s) available`,
          );
        }

        // 7. Create cart & reduce stock
        await prisma.product.update({
          where: { id: productId },
          data: {
            stock: {
              decrement: quantity,
            },
          },
        });

        await prisma.cart.create({
          data: {
            quantity,
            productId,
            userId,
          },
        });

        return { message: 'Item added to cart' };
      });
    } catch (error) {
      console.error('Error while adding to cart:', error);

      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }

      throw new InternalServerErrorException(
        'An unexpected error occurred while adding product to cart',
      );
    }
  }

  async updateCart(updateCartDto: UpdateCartDto) {
    const { cartItemId, newQuantity } = updateCartDto;
    try {
      return this.prisma.$transaction(async (prisma) => {
        const cartItem = await prisma.cart.findUnique({
          where: { id: cartItemId },
          include: {
            product: true,
          },
        });

        if (!cartItem) {
          throw new NotFoundException('Cart item not found');
        }
        const difference = newQuantity - cartItem.quantity;

        if (difference > 0 && difference > cartItem.product.stock) {
          throw new BadRequestException('Not enough stock');
        }

        const cartData = await prisma.cart.update({
          where: { id: cartItemId },
          data: { quantity: newQuantity },
        });

        await prisma.product.update({
          where: { id: cartItem.productId },
          data: {
            stock: {
              increment: -difference,
            },
          },
        });

        return cartData;
      });
    } catch (error) {
      console.error('Error while updating cart:', error);
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        'An unexpected error occurred while updating cart',
      );
    }
  }

  async removeFromCart(cartItemId: string, userId: string) {
    try {
      return await this.prisma.$transaction(async (prisma) => {
        const cartItem = await prisma.cart.findFirst({
          where: { userId, productId: cartItemId },
        });

        if (!cartItem) {
          throw new NotFoundException('Cart item not found');
        }

        await prisma.cart.delete({
          where: { id: cartItem.id },
        });

        await prisma.product.update({
          where: { id: cartItemId },
          data: {
            stock: {
              increment: cartItem.quantity,
            },
          },
        });

        return { message: 'Item removed from cart' };
      });
    } catch (error) {
      console.error('Error while removing from cart:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'An unexpected error occurred while removing item from cart',
      );
    }
  }

  async clearCart(userId: string) {
    try {
      return await this.prisma.$transaction(async (prisma) => {
        const cartItems = await prisma.cart.findMany({
          where: { userId },
        });

        if (cartItems.length === 0) {
          throw new NotFoundException('No items found in cart');
        }

        for (const item of cartItems) {
          await prisma.product.update({
            where: { id: item.productId },
            data: {
              stock: {
                increment: item.quantity,
              },
            },
          });
        }

        await prisma.cart.deleteMany({
          where: { userId },
        });

        return { message: 'Cart cleared successfully' };
      });
    } catch (error) {
      console.error('Error while clearing cart:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'An unexpected error occurred while clearing cart',
      );
    }
  }

  async syncCartFromLocal(items: AddToCartDto[], userId: string) {
    try {
      return await this.prisma.$transaction(async (prisma) => {
        for (const { productId, quantity } of items) {
          const product = await prisma.product.findUnique({
            where: { id: productId },
          });

          if (!product) {
            throw new NotFoundException(`Product ${productId} not found`);
          }

          if (quantity > product.stock) {
            throw new BadRequestException(
              `Not enough stock for product ${productId}`,
            );
          }

          const existingCart = await prisma.cart.findFirst({
            where: { userId, productId },
          });

          if (existingCart) {
            const newQuantity = existingCart.quantity + quantity;

            if (newQuantity > product.stock) {
              throw new BadRequestException(
                `Not enough stock for product ${productId}`,
              );
            }

            await prisma.cart.update({
              where: { id: existingCart.id },
              data: {
                quantity: newQuantity,
              },
            });

            await prisma.product.update({
              where: { id: productId },
              data: {
                stock: {
                  decrement: quantity,
                },
              },
            });
          } else {
            await prisma.cart.create({
              data: {
                productId,
                userId,
                quantity,
              },
            });

            await prisma.product.update({
              where: { id: productId },
              data: {
                stock: {
                  decrement: quantity,
                },
              },
            });
          }
        }

        return { message: 'Cart synced successfully' };
      });
    } catch (error) {
      console.error('Error while syncing cart:', error);
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        'An unexpected error occurred while syncing cart',
      );
    }
  }
}
