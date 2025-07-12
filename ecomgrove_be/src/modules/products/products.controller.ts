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
    @Query('categories') categories?: string[],
    @Query('price') price?: number,
    @Query('sort') sort?: string,
  ) {
    const isAll = all === 'true';
    const priceNumber = Number(price);

    const hasPrice = !isNaN(priceNumber);

    return this.productsService.findAllProduct(
      page,
      limit,
      isAll,
      sort,
      hasPrice ? priceNumber : undefined,
      categories,
    );
  }

  @Get(':id')
  async findOneProduct(@Param('id') id: string) {
    return this.productsService.findOneProduct(id);
  }
}
