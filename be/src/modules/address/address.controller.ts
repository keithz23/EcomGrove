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
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { Response, Request } from 'express';
import { JwtAddresssGuard } from './jwt-address.guard';
import { ApiBody } from '@nestjs/swagger';

@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @UseGuards(JwtAddresssGuard)
  @Post()
  async create(
    @Body() createAddressDto: CreateAddressDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const id = (req.user as any).id;
    const response = await this.addressService.create(createAddressDto, id);

    return res.status(200).json(response);
  }

  @Get()
  async findAll(@Req() req: Request, @Res() res: Response) {
    const response = await this.addressService.findAll();

    return res.status(200).json(response);
  }

  @UseGuards(JwtAddresssGuard)
  @Patch()
  async update(
    @Body() updateAddressDto: UpdateAddressDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const userEmail = (req.user as any).email;
    const response = await this.addressService.update(
      userEmail,
      updateAddressDto,
    );

    return res.status(200).json(response);
  }
}
