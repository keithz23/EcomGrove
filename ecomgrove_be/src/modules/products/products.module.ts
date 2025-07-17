import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { PermissionService } from '../auth/permissions.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [ProductsController],
  exports: [PermissionService],
  providers: [ProductsService, PermissionService, PrismaService],
})
export class ProductsModule {}
