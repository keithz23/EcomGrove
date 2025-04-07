import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { Request, Response } from 'express';
import { JwtAdminGuard } from './jwt-admin.guard';
import { CreateUserDto } from './dto/users/create-user.dto';
import { RestoreDto } from './dto/users/restore.dto';
import { SoftDeleteDto } from './dto/users/soft-delete.dto';
import { PermanentDto } from './dto/users/permanent.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @UseGuards(JwtAdminGuard)
  @Post('users')
  async createUser(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    try {
      const response = await this.adminService.create(createUserDto);

      return res.status(200).json(response);
    } catch (error) {
      return res.status(500).json({
        success: false,
        statusCode: 500,
        message: 'An unexpected occurred error. Please try again.',
      });
    }
  }

  @UseGuards(JwtAdminGuard)
  @Get('users')
  async findAllUsers(@Res() res: Response) {
    try {
      const response = await this.adminService.findAllUsers();

      return res.status(200).json(response);
    } catch (error) {
      return res.status(500).json({
        success: false,
        statusCode: 500,
        message: 'An unexpected occurred error. Please try again',
      });
    }
  }

  @UseGuards(JwtAdminGuard)
  @Get('users-find-all-deleted')
  async findAllDeletedUsers(@Res() res: Response) {
    try {
      const response = await this.adminService.findAllUsersSoftDeleted();

      return res.status(200).json(response);
    } catch (error) {
      return res.status(500).json({
        statusCode: 200,
        message: 'An unexpected occurred error. Please try again',
      });
    }
  }

  @UseGuards(JwtAdminGuard)
  @Post('users-restore')
  async restoreUsers(@Body() restoreDto: RestoreDto, @Res() res: Response) {
    try {
      if (!restoreDto.ids || restoreDto.ids.length === 0) {
        return res.status(400).json({
          statusCode: 400,
          message: 'No users IDs provided for restoration',
        });
      }

      const response = await this.adminService.restoreUsers(restoreDto.ids);

      return res.status(200).json(response);
    } catch (error) {
      return res.status(500).json({
        statusCode: 500,
        message: 'An unexpected occurred error. Please try again',
      });
    }
  }

  @UseGuards(JwtAdminGuard)
  @Delete('users-soft-delete')
  async softDeleteUsers(
    @Body() softDeleteDto: SoftDeleteDto,
    @Res() res: Response,
  ) {
    try {
      if (!softDeleteDto.ids || softDeleteDto.ids.length === 0) {
        return res.status(400).json({
          statusCode: 400,
          message: 'No users IDs provided for deletion',
        });
      }

      const response = await this.adminService.softDeletedUsers(
        softDeleteDto.ids,
      );

      return res.status(200).json(response);
    } catch (error) {
      return res.status(500).json({
        statusCode: 500,
        message: 'An unexpected occurred error. Please try again',
      });
    }
  }

  @UseGuards(JwtAdminGuard)
  @Delete('users-permanent-delete')
  async permanentDelete(
    @Body() permanentDeleteDto: PermanentDto,
    @Res() res: Response,
  ) {
    try {
      if (!permanentDeleteDto.ids || permanentDeleteDto.ids.length === 0) {
        return res.status(400).json({
          statusCode: 400,
          message: 'No users IDs provided for deletion',
        });
      }
      const response = await this.adminService.permanentDeletedUsers(
        permanentDeleteDto.ids,
      );
      return res.status(200).json(response);
    } catch (error) {
      return res.status(500).json({
        statusCode: 500,
        message: 'An unexpected occurred error. Please try again',
      });
    }
  }
}
