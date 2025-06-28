import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsPhoneNumber } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ default: 'Lunez' })
  @IsString()
  firstName: string;

  @ApiProperty({default: 'Wong'})
  @IsString()
  lastName: string;

  @ApiProperty({default: 'lunez'})
  @IsString()
  username: string;

  @ApiProperty({default: '0904347832'})
  @IsPhoneNumber('VN')
  phone: string;

  @ApiProperty({default: 'abc@gmail.com'})
  @IsEmail()
  email: string;

  @ApiProperty({default: 'Abc123@'})
  @IsString()
  password: string;
}
