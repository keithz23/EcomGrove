import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { UsersService } from '../users/users.service';
import { ConfigService } from '@nestjs/config';
import { RolesService } from '../roles/roles.service';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { PermissionsService } from '../permissions/permissions.service';

@Module({
  controllers: [AdminController],
  providers: [
    AdminService,
    UsersService,
    ConfigService,
    RolesService,
    PermissionsService,
    JwtStrategy,
  ],
})
export class AdminModule {}
