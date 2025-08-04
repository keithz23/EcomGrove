import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  Query,
} from '@nestjs/common';
import { AddressesService } from './addresses.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { Request } from 'express';
import { CombinedAuthGuard } from '../auth/guards/combined.guard';

@Controller('addresses')
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @Post()
  @UseGuards(CombinedAuthGuard)
  create(@Body() createAddressDto: CreateAddressDto, @Req() req: Request) {
    const user = (req as any).user.sub;
    return this.addressesService.create(createAddressDto, user);
  }

  @Patch(':id')
  update(
    @Query('userId') userId: string,
    @Query('addressId') addressId: string,
    @Body() updateAddressDto: UpdateAddressDto,
  ) {
    return this.addressesService.update(userId, addressId, updateAddressDto);
  }

  @Delete(':id')
  remove(
    @Query('userId') userId: string,
    @Query('addressId') addressId: string,
  ) {
    return this.addressesService.delete(userId, addressId);
  }
}
