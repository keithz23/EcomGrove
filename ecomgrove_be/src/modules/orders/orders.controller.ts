import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { CombinedAuthGuard } from '../auth/guards/combined.guard';

@Controller('orders')
@UseGuards(CombinedAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto, @Req() req: Request) {
    return this.ordersService.create((req as any).user.sub, createOrderDto);
  }

  @Get()
  findAll(@Req() req: Request) {
    return this.ordersService.findAll((req as any).user.sub);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: Request) {
    return this.ordersService.findOne((req as any).user.sub, id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
    @Req() req: Request,
  ) {
    return this.ordersService.update((req as any).user.sub, id, updateOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: Request) {
    return this.ordersService.remove((req as any).user.sub, id);
  }
}
