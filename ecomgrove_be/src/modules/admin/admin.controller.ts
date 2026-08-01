import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { PaginationQueryDto } from '../users/dto/pagination.dto';
import { CreateUserDto } from './dto/users/create-user.dto';
import { UpdateUserDto } from './dto/users/update-user.dto';
import { CreateRoleDto } from './dto/roles/create-role.dto';
import { UpdateRoleDto } from './dto/roles/update-role.dto';
import { Request } from 'express';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/config/multer.config';
import { ApiConsumes } from '@nestjs/swagger';
import { S3Service } from 'src/services/s3.service';
import { CombinedAuthGuard } from '../auth/guards/combined.guard';
import { AssignPermissionDto } from './dto/permissions/permissions.dto';
import { CreateProductDto } from './dto/products/create-product.dto';
import { UpdateProductDto } from './dto/products/update-product.dto';
import { CreateCategoryDto } from '../categories/dto/create-category.dto';
import { UpdateCategoryDto } from '../categories/dto/update-category.dto';
import { PermissionsGuard } from '../auth/guards/permissions.guard';

@Controller('admin')
@UseGuards(CombinedAuthGuard, PermissionsGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('users/create-user')
  @ApiConsumes('multipart/form-data')
  @Permissions('user:create')
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'picture', maxCount: 1 }], multerOptions),
  )
  async createUser(
    @Body() createUserDto: CreateUserDto,
    @UploadedFiles() files: { picture?: Express.Multer.File[] },
  ) {
    if (!files || !files.picture || files.picture.length === 0) {
      throw new BadRequestException('Image file is required');
    }
    const file = files.picture[0];
    const upload = await S3Service.uploadToS3({ imagePath: file }, 'avatar');
    return this.adminService.createUser(createUserDto, upload.url);
  }

  @Patch('users/update-user')
  @ApiConsumes('multipart/form-data')
  @Permissions('user:create')
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'picture', maxCount: 1 }], multerOptions),
  )
  async updateUser(
    @Body() updateUser: UpdateUserDto,
    @UploadedFiles() files: { picture?: Express.Multer.File[] },
  ) {
    let uploadedImageUrl: string | undefined;

    if (files?.picture?.length) {
      const file = files.picture[0];
      const upload = await S3Service.uploadToS3({ imagePath: file }, 'avatar');
      uploadedImageUrl = upload.url;
    }

    return this.adminService.updateUser(updateUser, uploadedImageUrl);
  }

  @Delete('users/delete-user/:id')
  @Permissions('user:read', 'user:create')
  async deleteUser(@Param('id') id: string) {
    return this.adminService.deleteUser(id);
  }

  @Get('users')
  @Permissions('user:read')
  @UsePipes(new ValidationPipe({ transform: true }))
  async findAllUser(@Query() query: PaginationQueryDto, @Req() req: Request) {
    const userId = (req as any).user.sub;
    return this.adminService.findAllUser(query, userId);
  }

  @Get('users/:id')
  @Permissions('user:read')
  async findOneUser(@Param('id') id: string) {
    return this.adminService.findOneUser(id);
  }

  // Roles
  @Post('roles/create-role')
  @Permissions('user:read', 'user:create')
  async createRole(@Body() createRoleDto: CreateRoleDto) {
    return this.adminService.createRole(createRoleDto);
  }

  @Patch('roles/update-role')
  @Permissions('user:read', 'user:create')
  async updateRole(@Body() updateRoleDto: UpdateRoleDto) {
    return this.adminService.updateRole(updateRoleDto);
  }

  @Delete('roles/delete-role/:id')
  @Permissions('user:read', 'user:create')
  async deleteRole(@Param('id') id: string) {
    return this.adminService.deleteRole(id);
  }

  @Get('roles/:id')
  @Permissions('user:read', 'user:create')
  async findOneRole(@Param('id') id: string) {
    return this.adminService.findOneRole(id);
  }

  @Get('roles')
  @Permissions('user:create')
  async findAllRoles(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('all') all: string = 'false',
  ) {
    const isAll = all === 'true';
    return this.adminService.findAllRoles(+page, +limit, isAll);
  }

  // Permissions
  @Post('permissions/assign-permissions')
  @Permissions('user:update')
  async assignPerm(@Body() assignPermissiondDto: AssignPermissionDto) {
    return this.adminService.assignPermission(assignPermissiondDto);
  }

  @Get('permissions')
  @Permissions('user:create')
  async findAllPermissions(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('all') all: string = 'false',
  ) {
    const isAll = all === 'true';
    return this.adminService.findAllPermissions(+page, +limit, isAll);
  }

  @Get('permissions/:id')
  @Permissions('user:read')
  async findOnePermission(@Param('id') id: string) {
    return this.adminService.findOnePermissions(id);
  }

  // Permission group
  @Get('permissions-group')
  @Permissions('user:create')
  async findAllPermissionGroup(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('all') all: string = 'false',
  ) {
    const isAll = all === 'true';
    return this.adminService.findAllPermissionGroup(+page, +limit, isAll);
  }

  // Product
  @Post('product/create-product')
  @ApiConsumes('multipart/form-data')
  @Permissions('product:create')
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'picture', maxCount: 1 }], multerOptions),
  )
  async createProduct(
    @Body() createProductDto: CreateProductDto,
    @UploadedFiles() files: { picture?: Express.Multer.File[] },
    @Req() req: Request,
  ) {
    const user = (req as any).user.sub;
    if (!files || !files.picture || files.picture.length === 0) {
      throw new BadRequestException('Image file is required');
    }
    const file = files.picture[0];
    const upload = await S3Service.uploadToS3({ imagePath: file }, 'product');
    return this.adminService.createProduct(createProductDto, upload.url, user);
  }

  @Patch('product/update-product')
  @ApiConsumes('multipart/form-data')
  @Permissions('product:update')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'picture', maxCount: 1 }]))
  async updateProduct(
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFiles() files: { picture?: Express.Multer.File[] },
    @Req() req: Request,
  ) {
    const user = (req as any).user.sub;
    let uploadedImageUrl: string | undefined;

    if (files?.picture?.length) {
      const file = files.picture[0];
      const upload = await S3Service.uploadToS3({ imagePath: file }, 'product');
      uploadedImageUrl = upload.url;
    }

    return this.adminService.updateProduct(
      updateProductDto,
      uploadedImageUrl,
      user,
    );
  }

  @Delete('product/delete-product/:id')
  @Permissions('product:delete')
  async deleteProduct(@Param('id') id: string) {
    return this.adminService.deleteProduct(id);
  }

  @Get('product')
  @Permissions('product:read')
  async findAllProducts(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('all') all: string = 'false',
    @Query('sort') sort: string,
    @Query('isAdmin') isAdmin: boolean,
    @Query('price') price?: number,
    @Query('categories') categories?: string[],
  ) {
    const isAll = all === 'true';
    return this.adminService.findAllProducts(
      +page,
      +limit,
      isAll,
      sort,
      isAdmin,
      price,
      categories,
    );
  }

  @Get('product/:id')
  @Permissions('product:read', 'product:create')
  async findOneProduct(@Param('id') id: string) {
    return this.adminService.findOneProduct(id);
  }

  // Categories
  @Post('categories/create-category')
  @Permissions('category:create')
  async createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return this.adminService.createCategories(createCategoryDto);
  }

  @Patch('categories/update-category')
  @Permissions('category:update')
  async updateCategory(@Body() updateCategoryDto: UpdateCategoryDto) {
    return this.adminService.updateCategory(updateCategoryDto);
  }

  @Get('categories')
  @Permissions('category:read')
  async findAllCategories(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('all') all: string = 'false',
  ) {
    const isAll = all === 'true';
    return this.adminService.findAllCategories(+page, +limit, isAll);
  }

  @Delete('categories/:id')
  @Permissions('category:delete')
  async deleteCategory(@Param('id') id: string) {
    return this.adminService.deleteCategory(id);
  }

  @Get('categories/:id')
  @Permissions('category:read')
  async findOneCategory(@Param('id') id: string) {
    return this.adminService.findOneCategory(id);
  }
}
