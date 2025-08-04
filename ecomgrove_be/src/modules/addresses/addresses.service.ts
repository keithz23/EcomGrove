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
      street,
      city,
      district,
      ward,
      country,
      zipCode,
      countryCallingCode,
    } = createAddressDto;

    try {
      const existingUser = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!existingUser) {
        throw new NotFoundException('User not found');
      }

      await this.prisma.address.create({
        data: {
          fullName,
          street,
          city,
          district,
          ward,
          zipCode,
          countryCallingCode,
          country: country || 'Vietnam',
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
      street,
      city,
      district,
      ward,
      country,
      zipCode,
      countryCallingCode,
    } = updateAddressDto;

    try {
      const existingAddress = await this.prisma.address.findUnique({
        where: { id: addressId },
      });

      if (!existingAddress || existingAddress.userId !== userId) {
        throw new NotFoundException('Address not found or unauthorized');
      }

      await this.prisma.address.update({
        where: { id: addressId },
        data: {
          fullName,
          street,
          city,
          district,
          ward,
          zipCode,
          countryCallingCode,
          country: country || 'Vietnam',
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

      await this.prisma.address.delete({
        where: { id: addressId },
      });

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
