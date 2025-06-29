import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class UpdateCartDto {
  @ApiProperty()
  @IsString()
  cartItemId: string;

  @ApiProperty()
  @IsNumber()
  newQuantity: number;
}
