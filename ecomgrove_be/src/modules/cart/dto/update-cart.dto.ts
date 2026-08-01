import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateCartDto {
  @ApiProperty()
  @IsString()
  cartItemId: string;

  @ApiProperty()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  newQuantity: number;
}
