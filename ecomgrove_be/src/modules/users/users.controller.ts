import {
  Controller,
  Get,
  Param,
  UsePipes,
  ValidationPipe,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { PaginationQueryDto } from './dto/pagination.dto';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Request } from 'express';

@Controller('users')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // @Get()
  // @Permissions('user:read')
  // @UsePipes(new ValidationPipe({ transform: true }))
  // async findAll(@Query() query: PaginationQueryDto) {
  //   return this.usersService.findAll(query);
  // }

  @Get(':id')
  @Permissions('user:read')
  async findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }
}
