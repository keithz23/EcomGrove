import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import * as argon from 'argon2';
import { UpdateUserDto } from './dto/update-admin.dto';

@Injectable()
export class AdminService {
  constructor(private readonly prismaService: PrismaService) {}

  async createUser(createUserDto: CreateUserDto) {
    const { firstName, lastName, email, username, password, phoneNumber } =
      createUserDto;

    try {
      const existingUser = await this.prismaService.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return {
          success: false,
          statusCode: 400,
          message: 'User already exist',
        };
      }

      const hashedPassword = await argon.hash(password);

      await this.prismaService.user.create({
        data: {
          firstName: firstName,
          lastName: lastName,
          email: email,
          username: username,
          password: hashedPassword,
        },
      });

      return {
        success: true,
        statusCode: 201,
        message: 'User created successfully',
      };
    } catch (error) {
      console.error('Error while creating user', error.message);
      throw new InternalServerErrorException();
    }
  }

  async updateUser(updateUserDto: UpdateUserDto) {
    const { firstName, lastName, email, username, password } = updateUserDto;

    try {
      const existingUser = await this.prismaService.user.findUnique({
        where: { email },
      });

      if (!existingUser) {
        return {
          success: false,
          statusCode: 400,
          message: 'User not found',
        };
      }

      if (email === existingUser.email) {
        return {
          success: false,
          statusCode: 400,
          message: 'Email has already been taken',
        };
      }

      const hashedPassword = await argon.hash(password);

      await this.prismaService.user.update({
        where: { id: existingUser.id },
        data: {
          firstName: firstName,
          lastName: lastName,
          email: email,
          username: username,
          password: hashedPassword,
        },
      });

      return {
        success: true,
        statusCode: 200,
        message: 'User updated successfully',
      };
    } catch (error) {
      console.error('Error while updating user:', error.message);
      throw new InternalServerErrorException();
    }
  }

  async findAllUsers(page: number = 1, limit: number = 10) {
    try {
      const skip = (page - 1) * limit;
      const [usersData, total] = await Promise.all([
        this.prismaService.user.findMany({
          skip,
          take: limit,
        }),
        this.prismaService.user.count(),
      ]);

      return {
        success: true,
        statusCode: 200,
        message: 'Fetched users successfully',
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        data: usersData,
      };
    } catch (error) {
      console.error('Error while fetching all users', error.message);
      throw new InternalServerErrorException();
    }
  }

  async findUserById(id: number) {
    try {
      const user = await this.prismaService.user.findFirst({
        where: { id },
      });

      if (!user) {
        return {
          success: false,
          statusCode: 400,
          message: 'User not founf',
        };
      }

      return {
        success: true,
        statusCode: 200,
        message: 'Fetched user successfully',
        data: user,
      };
    } catch (error) {
      console.error('Error while fetching user: ', error.message);
      throw new InternalServerErrorException();
    }
  }
}
