import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, Matches } from 'class-validator';

export class CreatePaymentDto {
  @ApiProperty()
  @IsString()
  orderId: string;

  @ApiProperty({
    description:
      'A stable, client-generated key for a single logical payment request.',
  })
  @IsString()
  @Length(16, 255)
  @Matches(/^[A-Za-z0-9_-]+$/)
  idempotencyKey: string;
}
