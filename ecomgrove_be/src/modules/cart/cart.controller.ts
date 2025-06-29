import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { CombinedAuthGuard } from '../auth/guards/combined.guard';
import { Request } from 'express';
import { UpdateCartDto } from './dto/update-cart.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @UseGuards(CombinedAuthGuard)
  async getCart(@Req() req: Request) {
    const user = (req as any).user.sub;
    return this.cartService.getCartByUser(user);
  }

  @Post()
  @UseGuards(CombinedAuthGuard)
  async addToCart(@Body() addToCartDto: AddToCartDto, @Req() req: Request) {
    const userId = (req as any).user.sub;
    return this.cartService.addToCart(addToCartDto, userId);
  }

  @Patch(':id')
  @UseGuards(CombinedAuthGuard)
  async updateCart(@Body() updateCartDto: UpdateCartDto) {
    return this.cartService.updateCart(updateCartDto);
  }

  @Delete(':id')
  @UseGuards(CombinedAuthGuard)
  async deleteCart(@Param('id') id: string) {
    return this.cartService.removeCartItem(id);
  }

  @Post('sync')
  @UseGuards(CombinedAuthGuard)
  async syncCart(@Body() items: AddToCartDto[], @Req() req: Request) {
    const userId = (req as any).user.sub;
    return this.cartService.syncCartFromLocal(items, userId);
  }
}
