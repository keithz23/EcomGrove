import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { UsersService } from '../users/users.service';
import { ConfigService } from '@nestjs/config';
import { RolesService } from '../roles/roles.service';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { PermissionsService } from '../permissions/permissions.service';
import { ProductsService } from '../products/products.service';
import { CategoriesService } from '../categories/categories.service';

@Module({
  controllers: [AdminController],
  providers: [
    AdminService,
    UsersService,
    ConfigService,
    RolesService,
    PermissionsService,
    ProductsService,
    CategoriesService,
    JwtStrategy,
  ],
})
export class AdminModule {}
