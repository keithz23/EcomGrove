import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { PrismaService } from 'src/database/prisma/prisma.service';
import * as argon from 'argon2';
import { UtilOtp } from 'src/utils/otp';
import { MailService } from 'src/utils/mail.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly mailService: MailService,
  ) {}
  create(createUserDto: CreateUserDto) {
    const { firstName, lastName, email, username, password, phoneNumber } =
      createUserDto;
    try {
      return this.prismaService.$transaction(async (prisma) => {
        const existingUser = await prisma.user.findFirst({
          where: {
            OR: [{ email }, { username }],
          },
        });

        if (existingUser) {
          const message =
            existingUser.email === email
              ? 'Email is already registered'
              : 'Username is already taken';

          return {
            statusCode: 400,
            success: false,
            message,
          };
        }

        const hashedPassword = await argon.hash(password);

        await prisma.user.create({
          data: {
            firstName,
            lastName,
            email,
            username,
            password: hashedPassword,
            phoneNumber,
          },
        });

        return {
          statusCode: 201,
          success: true,
          message: 'User created successfully',
        };
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Error while creating user',
        error.message,
      );
    }
  }

  async findAllUsers(page: number = 1, limit: number = 10) {
    try {
      const skip = (page - 1) * limit;
      const [usersData, total] = await Promise.all([
        this.prismaService.user.findMany({
          skip,
          take: limit,
          where: { isDeleted: false },
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
      console.error('Error while fetching all users data: ', error.message);
      throw new InternalServerErrorException();
    }
  }

  async findUserById(id: number) {
    try {
      const user = await this.prismaService.user.findUnique({
        where: { id },
      });

      if (!user) {
        return {
          success: false,
          statusCode: 400,
          message: 'User not found',
        };
      }
      return {
        success: true,
        statusCode: 200,
        message: 'Fetched user successfully',
        data: user,
      };
    } catch (error) {
      console.error('Error while fetching use: ', error.message);
      throw new InternalServerErrorException();
    }
  }

  async sendOtpCode(email: string, username: string) {
    try {
      const otp = UtilOtp.generateOtp();
      const otpExpiry = UtilOtp.getOtpExpiration();

      await this.prismaService.user.update({
        where: { email },
        data: {
          passwordResetToken: String(otp),
          passwordResetExpiry: otpExpiry,
        },
      });

      await this.mailService.sendConfirmChangeInfoOtp(
        email,
        username,
        String(otp),
      );

      return {
        statusCode: 200,
        success: true,
        message: 'Email send successfully',
      };
    } catch (error) {
      console.error('Error while sending email:', error);
      throw new InternalServerErrorException();
    }
  }

  async updateUser(updateUserDto: UpdateUserDto) {
    const { firstName, lastName, email, username, password, phoneNumber } =
      updateUserDto;

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
          firstName,
          lastName,
          email,
          username,
          password: hashedPassword,
          phoneNumber,
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

  async softDeleteUsers(ids: number[]) {
    try {
      const result = await this.prismaService.user.updateMany({
        where: { id: { in: ids }, isDeleted: false },
        data: {
          isDeleted: true,
        },
      });

      if (result.count === 0) {
        return {
          success: false,
          statusCode: 400,
          message: 'They may not exist or are already deleted',
        };
      }

      return {
        success: true,
        statusCode: 200,
        message: `${result.count} users deleted successfully`,
      };
    } catch (error) {
      console.error('Error while delete users', error.message);
      throw new InternalServerErrorException();
    }
  }

  async findAllUsersSoftDeleted(page: number = 1, limit: number = 10) {
    try {
      const skip = (page - 1) * limit;
      const [usersData, total] = await Promise.all([
        await this.prismaService.user.findMany({
          where: { isDeleted: true },
          skip,
          take: limit,
        }),
        await this.prismaService.user.count({ where: { isDeleted: true } }),
      ]);

      return {
        success: true,
        statusCode: 200,
        message: 'Fetched user successfully',
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        data: usersData,
      };
    } catch (error) {
      console.error('Error while fetching deleted user', error.message);
      throw new InternalServerErrorException();
    }
  }

  async permanentDelete(ids: number[]) {
    try {
      const result = await this.prismaService.user.deleteMany({
        where: { id: { in: ids }, isDeleted: true },
      });
      return {
        success: false,
        statusCode: 200,
        message: `${result.count} users deleted`,
      };
    } catch (error) {
      console.error('Error while deleting users', error.message);
      throw new InternalServerErrorException();
    }
  }

  async restoreUsers(ids: number[]) {
    try {
      const result = await this.prismaService.user.updateMany({
        where: { id: { in: ids } },
        data: {
          isDeleted: false,
        },
      });

      if (result.count === 0) {
        return {
          success: false,
          statusCode: 400,
          message: 'No products were stored',
        };
      }

      return {
        success: true,
        statusCode: 200,
        message: `${result.count} users restored successfully`,
      };
    } catch (error) {
      console.error('Error while restoring user data: ', error.message);
      throw new InternalServerErrorException();
    }
  }

  async updateUserProfile(
    userEmail: string,
    userUpdate: UpdateProfileDto,
    otp: string,
  ) {
    const { firstName, lastName, username, email, phoneNumber } = userUpdate;
    try {
      return await this.prismaService.$transaction(async (prisma) => {
        const existingUser = await prisma.user.findFirst({
          where: {
            AND: [
              { email: { not: userEmail } },
              {
                OR: [{ email }, { username }, { phoneNumber }],
              },
            ],
          },
        });

        if (existingUser) {
          let message = '';
          if (existingUser.email === email) {
            message = 'Email is already registered';
          } else if (existingUser.username === username) {
            message = 'Username is already taken';
          } else if (existingUser.phoneNumber === phoneNumber) {
            message = 'Phone number is already registered';
          }

          return {
            statusCode: 400,
            success: false,
            message,
          };
        }

        const validOtp = await prisma.user.findUnique({
          where: { passwordResetToken: otp },
          select: { passwordResetExpiry: true },
        });

        if (!validOtp) {
          return {
            statusCode: 400,
            success: false,
            message: 'OTP is invalid',
          };
        }

        if (
          validOtp.passwordResetExpiry &&
          validOtp.passwordResetExpiry < new Date()
        ) {
          return {
            statusCode: 400,
            success: false,
            message: 'OTP has expired',
          };
        }

        const updatedUser = await prisma.user.update({
          where: { email: userEmail },
          data: {
            firstName,
            lastName,
            username,
            email,
            phoneNumber,
            passwordResetToken: null,
            passwordResetExpiry: null,
          },
        });

        return {
          statusCode: 200,
          success: true,
          message: 'User profile updated successfully',
          data: updatedUser,
        };
      });
    } catch (error) {
      console.error('Error while updating user profile:', error.message);
      throw new InternalServerErrorException();
    }
  }

  async uploadAvatar(imagePath: string, userEmail: string) {
    try {
      return await this.prismaService.$transaction(async (prisma) => {
        const existingUser = await prisma.user.findFirst({
          where: { email: userEmail },
        });

        if (!existingUser) {
          return {
            statusCode: 400,
            success: false,
            message: 'Invalid credentials',
          };
        }

        const updatedUser = await prisma.user.update({
          where: { email: userEmail },
          data: { profile_picture: imagePath },
        });

        if (!updatedUser) {
          return {
            statusCode: 500,
            success: false,
            message: 'Failed to update avatar',
          };
        }

        return {
          statusCode: 200,
          success: true,
          message: 'Avatar changed successfully',
        };
      });
    } catch (error) {
      console.error(`Error updating avatar for ${userEmail}: ${error.message}`);
      return {
        statusCode: 500,
        success: false,
        message: 'Internal Server Error',
      };
    }
  }
}
