import { Controller, Get, Param, Query } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async findAllProducts(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('all') all: string,
  ) {
    const isAll = all === 'true';
    console.log(page);
    console.log(limit);
    console.log(all);
    return this.productsService.findAllProduct(page, limit, isAll);
  }

  @Get(':id')
  async findOneProduct(@Param('id') id: string) {
    return this.productsService.findOneProduct(id);
  }
}
