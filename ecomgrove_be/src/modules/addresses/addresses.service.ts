import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AddressesService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createAddressDto: CreateAddressDto, userId: string) {
    const {
      fullName,
      phone,
      street,
      city,
      district,
      ward,
      country,
      isDefault,
    } = createAddressDto;

    try {
      const existingUser = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!existingUser) {
        throw new NotFoundException('User not found');
      }

      if (isDefault) {
        await this.prisma.address.updateMany({
          where: { userId },
          data: { isDefault: false },
        });
      }

      await this.prisma.address.create({
        data: {
          fullName,
          phone,
          street,
          city,
          district,
          ward,
          country: country || 'Vietnam',
          isDefault: isDefault ?? false,
          userId,
        },
      });

      return { message: 'Address added successfully' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'An unexpected error occurred while creating the address.',
      );
    }
  }

  async update(
    userId: string,
    addressId: string,
    updateAddressDto: UpdateAddressDto,
  ) {
    const {
      fullName,
      phone,
      street,
      city,
      district,
      ward,
      country,
      isDefault,
    } = updateAddressDto;

    try {
      const existingAddress = await this.prisma.address.findUnique({
        where: { id: addressId },
      });

      if (!existingAddress || existingAddress.userId !== userId) {
        throw new NotFoundException('Address not found or unauthorized');
      }

      if (isDefault) {
        await this.prisma.address.updateMany({
          where: { userId },
          data: { isDefault: false },
        });
      }

      await this.prisma.address.update({
        where: { id: addressId },
        data: {
          fullName,
          phone,
          street,
          city,
          district,
          ward,
          country: country || 'Vietnam',
          isDefault: isDefault ?? false,
        },
      });

      return { message: 'Address updated successfully' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'An unexpected error occurred while updating the address.',
      );
    }
  }

  async delete(userId: string, addressId: string) {
    try {
      const address = await this.prisma.address.findUnique({
        where: { id: addressId },
      });

      if (!address || address.userId !== userId) {
        throw new NotFoundException('Address not found or unauthorized');
      }

      const isDefault = address.isDefault;

      await this.prisma.address.delete({
        where: { id: addressId },
      });

      if (isDefault) {
        const otherAddress = await this.prisma.address.findFirst({
          where: { userId },
          orderBy: { createdAt: 'asc' },
        });

        if (otherAddress) {
          await this.prisma.address.update({
            where: { id: otherAddress.id },
            data: { isDefault: true },
          });
        }
      }

      return { message: 'Address deleted successfully' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'An unexpected error occurred while deleting the address.',
      );
    }
  }
}
