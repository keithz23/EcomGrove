import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { validationSchema } from './config/validation.schema';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { AuthModule } from './modules/auth/auth.module';
import { AddressesModule } from './modules/addresses/addresses.module';
import { CacheModule } from './modules/cache/cache.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { CouponModule } from './modules/coupon/coupon.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { OrdersModule } from './modules/orders/orders.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { ProductsModule } from './modules/products/products.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { RolesModule } from './modules/roles/roles.module';
import { UsersModule } from './modules/users/users.module';
import { AdminModule } from './modules/admin/admin.module';
import { CartModule } from './modules/cart/cart.module';
import { MailModule } from './modules/mail/mail.module';
import { PermissionModule } from './modules/auth/permissions.module';
import { PermissionsModule } from './modules/permissions/permissions.module';

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

    AddressesModule,
    AuthModule,
    CacheModule,
    CategoriesModule,
    CouponModule,
    NotificationsModule,
    OrdersModule,
    PaymentsModule,
    PermissionModule,
    PermissionsModule,
    ProductsModule,
    ReviewsModule,
    RolesModule,
    UsersModule,
    CartModule,
    AdminModule,
    MailModule,
  ],
  providers: [AppService],
})
export class AppModule {}
