import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllProduct(page: number, limit: number, all) {
    const safePage = Math.max(1, page);
    const safeLimit = Math.min(Math.max(1, limit), 100);
    const skip = (safePage - 1) * safeLimit;

    try {
      if (all || limit === -1) {
        const productsData = await this.prisma.product.findMany({
          orderBy: { createdAt: 'desc' },
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
          orderBy: { createdAt: 'desc' },
          include: {
            category: true,
          },
        }),
        this.prisma.product.count(),
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
        'An unexpected error occured while fetching all products data',
      );
    }
  }

  async findOneProduct(id: string) {
    try {
      const product = await this.prisma.product.findFirst({
        where: { id },
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
