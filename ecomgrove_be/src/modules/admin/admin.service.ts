import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PaginationQueryDto } from '../users/dto/pagination.dto';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from './dto/users/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { UpdateUserDto } from './dto/users/update-user.dto';
import { RolesService } from '../roles/roles.service';
import { CreateRoleDto } from './dto/roles/create-role.dto';
import { UpdateRoleDto } from './dto/roles/update-role.dto';
import { PermissionsService } from '../permissions/permissions.service';
import { AssignPermissionDto } from './dto/permissions/permissions.dto';
import { CreateProductDto } from './dto/products/create-product.dto';
import { UpdateProductDto } from './dto/products/update-product.dto';
import { Prisma } from '@prisma/client';
import { ProductsService } from '../products/products.service';
import { CreateCategoryDto } from '../categories/dto/create-category.dto';
import { UpdateCategoryDto } from '../categories/dto/update-category.dto';
import { CategoriesService } from '../categories/categories.service';

@Injectable()
export class AdminService {
  constructor(
    private readonly usersService: UsersService,
    private readonly rolesService: RolesService,
    private readonly permissionsService: PermissionsService,
    private readonly productsService: ProductsService,
    private readonly categoriesService: CategoriesService,
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  async createUser(createUserDto: CreateUserDto, picture: string) {
    try {
      const {
        email,
        password,
        firstName,
        lastName,
        username,
        phone,
        role,
        status,
      } = createUserDto;

      // 1. Check if user already exists
      const existingUser = await this.prisma.user.findUnique({
        where: { email },
      });
      if (existingUser) {
        throw new BadRequestException('User with this email already exists');
      }

      // 2. Hash password
      const saltRounds =
        Number(this.configService.get('config.security.bcryptSaltRounds')) ||
        10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const roleEntity = await this.prisma.role.findUnique({
        where: { name: role },
      });

      if (!roleEntity) {
        throw new NotFoundException(`Role "${role}" does not exist`);
      }

      const user = await this.prisma.user.create({
        data: {
          firstName,
          lastName,
          username,
          email,
          phone,
          picture,
          password: hashedPassword,
          isActive: status === 'true' || status === '1',
          userRoles: {
            create: {
              roleId: roleEntity.id,
            },
          },
        },
        include: {
          userRoles: {
            include: { role: true },
          },
        },
      });

      const { password: _, ...safeUser } = user;
      return safeUser;
    } catch (error) {
      console.error('Error creating user:', error);
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Error while creating user');
    }
  }

  async updateUser(updateUserDto: UpdateUserDto, picture: string) {
    const { firstName, lastName, email, username, phone, role, status } =
      updateUserDto;

    try {
      const existingUser = await this.prisma.user.findUnique({
        where: { email },
      });

      if (!existingUser) {
        throw new NotFoundException(`User with email ${email} not found`);
      }

      const roleEntity = await this.prisma.role.findUnique({
        where: { name: role },
      });

      if (!roleEntity) {
        throw new NotFoundException(`Role "${role}" not found`);
      }

      const user = await this.prisma.user.update({
        where: { email },
        data: {
          firstName,
          lastName,
          phone,
          username,
          picture,
          isActive: ['true', '1', true, 1].includes(status),
          userRoles: {
            deleteMany: {},
            create: {
              roleId: roleEntity.id,
            },
          },
        },
        include: {
          userRoles: {
            include: {
              role: true,
            },
          },
        },
      });

      return user;
    } catch (error) {
      console.error('Error updating user:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error while updating user');
    }
  }

  async deleteUser(id: string): Promise<{ message: string }> {
    try {
      const existingRole = await this.prisma.user.findUnique({ where: { id } });

      if (!existingRole) {
        throw new NotFoundException(`User with id ${id} not found`);
      }

      await this.prisma.user.delete({ where: { id } });

      return { message: `User with id ${id} deleted successfully` };
    } catch (error) {
      console.error(`Error deleting user with id ${id}:`, error);

      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException('Error while deleting user');
    }
  }

  async findAllUser(query: PaginationQueryDto, userId) {
    return this.usersService.findAll(query, userId);
  }

  async findOneUser(id: string) {
    return this.usersService.findOne(id);
  }

  // Roles
  async createRole(createRoleDto: CreateRoleDto) {
    const { name, description } = createRoleDto;

    try {
      const existingRole = await this.prisma.role.findFirst({
        where: { name },
      });

      if (existingRole) {
        throw new BadRequestException('Role name already exists');
      }

      const role = await this.prisma.role.create({
        data: {
          name,
          description,
        },
      });

      return role;
    } catch (error) {
      console.error('Error while creating role: ', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'An unexpected error occurred while creating the role.',
      );
    }
  }

  async updateRole(updateRoleDto: UpdateRoleDto) {
    const { id, name, description } = updateRoleDto;
    try {
      const existingRole = await this.prisma.role.findFirst({
        where: { id },
      });

      if (!existingRole) {
        throw new NotFoundException(`Role with id ${id} not found`);
      }

      const role = await this.prisma.role.update({
        where: { id },
        data: {
          ...(name && { name }),
          ...(description && { description }),
        },
      });

      return role;
    } catch (error) {
      console.error('Error while updating role: ', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'An unexpected error occured while updating the role.',
      );
    }
  }

  async deleteRole(id: string): Promise<{ message: string }> {
    try {
      const existingRole = await this.prisma.role.findUnique({ where: { id } });

      if (!existingRole) {
        throw new NotFoundException(`Role with id ${id} not found`);
      }

      await this.prisma.role.delete({ where: { id } });

      return { message: `Role with id ${id} deleted successfully` };
    } catch (error) {
      console.error(`Error deleting role with id ${id}:`, error);

      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException(
        'An unexpected error occured while updating the role.',
      );
    }
  }

  async findAllRoles(page, limit, all) {
    return this.rolesService.findAllRoles(page, limit, all);
  }

  async findOneRole(id: string) {
    return this.rolesService.findOneRole(id);
  }

  // Permissions
  async assignPermission(assignPermissiondDto: AssignPermissionDto) {
    return this.permissionsService.assignPermissions(
      assignPermissiondDto.roleId,
      assignPermissiondDto.permissionsId,
    );
  }

  async findAllPermissions(page, limit, all) {
    return this.permissionsService.findAllPermission(page, limit, all);
  }

  async findOnePermissions(id: string) {
    return this.permissionsService.findOnePermission(id);
  }

  // Permission Group
  async findAllPermissionGroup(page, limit, all) {
    return this.permissionsService.findAllPermissionGroup(page, limit, all);
  }

  // Product
  async createProduct(
    createProductDto: CreateProductDto,
    picture: string,
    userId: string,
  ) {
    const {
      name,
      categoryId,
      price,
      stock,
      description,
      isActive = true,
    } = createProductDto;

    try {
      const existingProduct = await this.prisma.product.findFirst({
        where: { name },
      });

      if (existingProduct) {
        throw new BadRequestException('Product name already exists');
      }

      const product = await this.prisma.product.create({
        data: {
          name,
          price,
          stock,
          description,
          isActive,
          image: picture,
          category: {
            connect: { id: categoryId },
          },
          author: {
            connect: { id: userId },
          },
        },
      });

      return product;
    } catch (error) {
      console.error('Error while creating product', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'An unexpected error occured while creating product',
      );
    }
  }

  async updateProduct(
    updateProductDto: UpdateProductDto,
    picture: string,
    userId: string,
  ) {
    const { id, name, categoryId, price, stock, description, isActive } =
      updateProductDto;

    try {
      const existingProduct = await this.prisma.product.findFirst({
        where: { id },
      });

      if (!existingProduct) {
        throw new NotFoundException(`Role with id ${id} not found`);
      }

      await this.prisma.product.update({
        where: { id },
        data: {
          name,
          price,
          stock,
          image: picture,
          description,
          isActive,
          category: {
            connect: { id: categoryId },
          },
          author: {
            connect: { id: userId },
          },
        },
      });

      return {
        message: 'Product updated successfully',
      };
    } catch (error) {
      console.error('Error while updating product: ', error);
      if (error instanceof NotFoundException) throw error;

      throw new InternalServerErrorException(
        'An unexpected error occured while updating the product',
      );
    }
  }

  async deleteProduct(productId: string) {
    try {
      await this.prisma.product.delete({
        where: { id: productId },
      });

      return { message: 'Product deleted successfully' };
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(`Product with id ${productId} not found`);
      }

      console.error('Unexpected error while deleting product:', error);
      throw new InternalServerErrorException(
        'An unexpected error occurred while deleting product',
      );
    }
  }

  async findAllProducts(page, limit, all) {
    return this.productsService.findAllProduct(page, limit, all);
  }

  async findOneProduct(id) {
    return this.productsService.findOneProduct(id);
  }

  // Categories
  async createCategories(createCategoriesDto: CreateCategoryDto) {
    const { name, description } = createCategoriesDto;
    try {
      const existingCategoryName = await this.prisma.category.findFirst({
        where: { name },
      });

      if (existingCategoryName)
        throw new BadRequestException('Category name already exists');

      const category = await this.prisma.category.create({
        data: {
          name,
          description,
        },
      });

      return category;
    } catch (error) {
      console.error('Error while creating category:', error);
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException(
        'An unexpected error occured while creating category',
      );
    }
  }

  async updateCategory(updateCategoryDto: UpdateCategoryDto) {
    const { id, name, description } = updateCategoryDto;
    try {
      const existingCategory = await this.prisma.category.findFirst({
        where: { id },
      });

      if (!existingCategory) {
        throw new NotFoundException(`Category with id ${id} not found`);
      }

      const category = await this.prisma.category.update({
        where: { id },
        data: {
          name,
          description,
        },
      });

      return category;
    } catch (error) {
      console.error('Error while updating category:', error);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        'An unexpected error occured while updating category',
      );
    }
  }

  async deleteCategory(id: string) {
    try {
      const existingCategory = await this.prisma.category.findFirst({
        where: { id },
      });

      if (!existingCategory) {
        throw new NotFoundException(`Category with id ${id} not found`);
      }

      await this.prisma.category.delete({
        where: { id },
      });
    } catch (error) {
      console.error('Error while deleting category:', error);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        'An unexptecd error occured while deleting category',
      );
    }
  }

  async findAllCategories(page, limit, all) {
    return this.categoriesService.findAllCategories(page, limit, all);
  }

  async findOneCategory(id) {
    return this.categoriesService.findOneCategory(id);
  }
}
