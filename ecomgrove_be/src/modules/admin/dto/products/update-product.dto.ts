import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class UpdateProductDto {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  categoryId: string;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  price: number;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  stock: number;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsString()
  isActive: string;

  @ApiProperty({ type: 'string', format: 'binary', required: false })
  @IsOptional()
  picture?: any;

  @ApiProperty()
  @IsString()
  status: string;
}
