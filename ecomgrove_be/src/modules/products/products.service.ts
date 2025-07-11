import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ESortType } from 'src/common/enums/ESortType';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllProduct(
    page: number,
    limit: number,
    all: boolean,
    sort: string,
    price?: number,
    categories?: string,
  ) {
    const safePage = Math.max(1, page);
    const safeLimit = Math.min(Math.max(1, limit), 100);
    const skip = (safePage - 1) * safeLimit;

    // Build dynamic filters
    const where: any = {};
    if (typeof price === 'number') {
      where.price = { lt: price };
    }
    if (categories) {
      where.category = {
        name: {
          equals: categories,
          mode: 'insensitive',
        },
      };
    }

    // Sorting
    let orderBy: any = {};
    switch (sort) {
      case 'high-to-low':
        orderBy = { price: 'desc' };
        break;
      case 'low-to-high':
        orderBy = { price: 'asc' };
        break;
      case 'new-added':
        orderBy = { createdAt: 'desc' };
        break;
      default:
        orderBy = {};
    }

    try {
      if (all || limit === -1) {
        const productsData = await this.prisma.product.findMany({
          where,
          orderBy: Object.keys(orderBy).length > 0 ? orderBy : undefined,
          include: {
            category: {
              include: {
                products: true,
              },
            },
            author: true,
          },
        });

        return {
          message: 'All products fetched successfully',
          currentPage: 1,
          totalPages: 1,
          totalItems: productsData.length,
          data: productsData,
        };
      }

      const [productsData, total] = await Promise.all([
        this.prisma.product.findMany({
          skip,
          take: safeLimit,
          where,
          orderBy: Object.keys(orderBy).length > 0 ? orderBy : undefined,
          include: {
            category: true,
          },
        }),
        this.prisma.product.count({ where }),
      ]);

      return {
        message: 'Products fetched successfully',
        currentPage: safePage,
        totalPages: Math.ceil(total / safeLimit),
        totalItems: total,
        data: productsData,
      };
    } catch (error) {
      console.error('Error while fetching all products data: ', error);
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        'An unexpected error occurred while fetching all products data',
      );
    }
  }

  async findOneProduct(id: string) {
    try {
      const product = await this.prisma.product.findFirst({
        where: { id },
        include: {
          category: true,
        },
      });
      if (!product) {
        throw new NotFoundException(`Product with id ${id} not found`);
      }

      return product;
    } catch (error) {
      console.error('Error while fetching product data:', error);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        'An unexpected error occured while fetching product data',
      );
    }
  }
}
