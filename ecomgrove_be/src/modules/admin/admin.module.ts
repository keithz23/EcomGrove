import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { UsersService } from '../users/users.service';
import { ConfigService } from '@nestjs/config';
import { RolesService } from '../roles/roles.service';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { ProductsService } from '../products/products.service';
import { CategoriesService } from '../categories/categories.service';
import { PermissionService } from '../auth/permissions.service';
import { PermissionModule } from '../auth/permissions.module';
import { PermissionsModule } from '../permissions/permissions.module';
import { PermissionsService } from '../permissions/permissions.service';

@Module({
  imports: [PermissionModule, PermissionsModule],
  controllers: [AdminController],
  providers: [
    AdminService,
    UsersService,
    ConfigService,
    RolesService,
    PermissionService,
    PermissionsService,
    ProductsService,
    CategoriesService,
    JwtStrategy,
  ],
})
export class AdminModule {}
