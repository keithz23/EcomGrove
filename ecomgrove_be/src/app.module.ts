import { Module } from '@nestjs/common';
import { validationSchema } from './config/validation.schema';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { AuthModule } from './modules/auth/auth.module';
import { AddressesModule } from './modules/addresses/addresses.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { ProductsModule } from './modules/products/products.module';
import { RolesModule } from './modules/roles/roles.module';
import { UsersModule } from './modules/users/users.module';
import { AdminModule } from './modules/admin/admin.module';
import { CartModule } from './modules/cart/cart.module';
import { MailModule } from './modules/mail/mail.module';
import { PermissionModule } from './modules/auth/permissions.module';
import { PermissionsModule } from './modules/permissions/permissions.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { ScheduleModule } from '@nestjs/schedule';
import { OrdersModule } from './modules/orders/orders.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema,
      validationOptions: {
        allowUnknown: true,
        abortEarly: true,
      },
    }),
    ScheduleModule.forRoot(),

    AddressesModule,
    AuthModule,
    CategoriesModule,
    PermissionModule,
    PermissionsModule,
    ProductsModule,
    RolesModule,
    UsersModule,
    CartModule,
    AdminModule,
    MailModule,
    PaymentsModule,
    OrdersModule,
  ],
  providers: [AppService],
})
export class AppModule {}
