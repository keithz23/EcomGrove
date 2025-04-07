import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma/prisma.service';
import * as argon from 'argon2';
import { UpdateUserDto } from './dto/users/update-admin.dto';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from './dto/users/create-user.dto';

@Injectable()
export class AdminService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly usersService: UsersService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const response = await this.usersService.create(createUserDto);

      return response;
    } catch (error) {
      console.error('Error while creating user: ', error.message);
      throw new InternalServerErrorException();
    }
  }

  async findAllUsers() {
    try {
      const response = await this.usersService.findAllUsers();

      return response;
    } catch (error) {
      console.error('Error while fetching users data: ', error.message);
      throw new InternalServerErrorException();
    }
  }

  async findUserById(id: number) {
    try {
      const response = await this.usersService.findUserById(+id);

      return response;
    } catch (error) {
      console.error('Error while fetching user data: ', error.messsage);
      throw new InternalServerErrorException();
    }
  }

  async updateUser(updateUserDto: UpdateUserDto) {
    try {
      const response = await this.usersService.updateUser(updateUserDto);

      return response;
    } catch (error) {
      console.error('Error while updating user: ', error.message);
      throw new InternalServerErrorException();
    }
  }

  async softDeletedUsers(ids: number[]) {
    try {
      const response = await this.usersService.softDeleteUsers(ids);

      return response;
    } catch (error) {
      console.error('Error while deleting users: ', error.message);
      throw new InternalServerErrorException();
    }
  }

  async permanentDeletedUsers(ids: number[]) {
    try {
      const response = await this.usersService.permanentDelete(ids);

      return response;
    } catch (error) {
      console.error('Error while deleting user: ', error.message);
      throw new InternalServerErrorException();
    }
  }

  async restoreUsers(ids: number[]) {
    try {
      const response = await this.usersService.restoreUsers(ids);

      return response;
    } catch (error) {
      console.error('Error while restoring user: ', error.message);
      throw new InternalServerErrorException();
    }
  }

  async findAllUsersSoftDeleted() {
    try {
      const response = await this.usersService.findAllUsersSoftDeleted();

      return response;
    } catch (error) {
      console.error('Error while fetching users data: ', error.message);
      throw new InternalServerErrorException();
    }
  }
}
