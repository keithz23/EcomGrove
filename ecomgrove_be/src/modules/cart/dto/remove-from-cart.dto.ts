import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RemoveFromCartDto {
  @ApiProperty()
  @IsString()
  cartItemId: string;
}
