import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ default: 'John' })
  @IsString()
  firstName: string;

  @ApiProperty({ default: 'Doe' })
  @IsString()
  lastName: string;

  @ApiProperty({ default: 'johndoe@gmail.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ default: 'johndoez' })
  @IsString()
  username: string;

  @ApiProperty({ default: '090433234' })
  @IsString()
  phone: string;

  @ApiProperty({ default: 'johdoe@123' })
  @IsString()
  password: string;

  @ApiProperty({ default: 'customer' })
  @IsString()
  role: string;

  @ApiProperty({ default: 'active' })
  @IsString()
  status: string;

  @ApiProperty({ type: 'string', format: 'binary' })
  picture: any;
}
