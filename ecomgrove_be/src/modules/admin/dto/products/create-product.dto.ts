import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsString } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class CreateProductDto {
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

  @ApiProperty({ type: 'string', format: 'binary' })
  picture: any;
}
