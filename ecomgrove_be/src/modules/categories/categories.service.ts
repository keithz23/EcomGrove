import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createCategoryDto: CreateCategoryDto) {
    const { name, description } = createCategoryDto;

    const existingCategory = this.prisma.category.findUnique({
      where: { name },
    });

    if (existingCategory) {
      throw new ConflictException('Category name is already exists');
    }

    try {
      const categoriesData = await this.prisma.category.create({
        data: {
          name,
          description,
        },
      });

      return categoriesData;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async findAllCategories(page: number, limit: number, all: string) {
    const safePage = Math.max(1, page);
    const safeLimit = Math.min(Math.max(1, limit), 100);
    const skip = (safePage - 1) * safeLimit;

    try {
      if (all || limit == -1) {
        const categoriesData = await this.prisma.category.findMany({
          orderBy: { createdAt: 'desc' },
          include: {
            products: {
              include: {
                author: true,
              },
            },
          },
        });

        return {
          message: 'All categories fetched successfully',
          currentPage: 1,
          totalPages: 1,
          totalItems: categoriesData.length,
          data: categoriesData,
        };
      }

      const [categoriesData, total] = await Promise.all([
        this.prisma.category.findMany({
          skip,
          take: safeLimit,
          orderBy: { createdAt: 'desc' },
          include: {
            products: {
              include: { author: true },
            },
          },
        }),
        this.prisma.category.count(),
      ]);

      return {
        message: 'Categories fetched successfully',
        currentPage: safePage,
        totalPages: Math.ceil(total / safeLimit),
        totalItems: total,
        data: categoriesData,
      };
    } catch (error) {
      console.error('Error while fetching all categories data:', error);
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        'An unexpected error occured while fetching all categories data',
      );
    }
  }

  async findOneCategory(id: string) {
    try {
      const existingCategory = await this.prisma.category.findFirst({
        where: { id },
      });

      if (!existingCategory) {
        throw new NotFoundException(`Category with id ${id} not found`);
      }

      return existingCategory;
    } catch (error) {
      console.error('Error while fetch category data:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'An unexpected error occured while fetching category data',
      );
    }
  }

  findAll() {
    return `This action returns all categories`;
  }

  findOne(id: number) {
    return `This action returns a #${id} category`;
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
