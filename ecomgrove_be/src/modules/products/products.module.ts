import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { PermissionsService } from '../auth/permissions.service';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService, PermissionsService],
})
export class ProductsModule {}
