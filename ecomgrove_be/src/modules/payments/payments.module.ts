import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { PaymentsReconciliationService } from './payments-reconciliation.service';
import { PermissionModule } from '../auth/permissions.module';

@Module({
  imports: [PermissionModule],
  controllers: [PaymentsController],
  providers: [PaymentsService, PaymentsReconciliationService, PrismaService],
})
export class PaymentsModule {}
