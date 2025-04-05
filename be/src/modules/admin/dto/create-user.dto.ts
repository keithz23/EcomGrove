import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ default: 'Lunez' })
  firstName: string;

  @ApiProperty({ default: 'Chan' })
  lastName: string;

  @ApiProperty({ default: 'lunezchan@gmail.com' })
  email: string;

  @ApiProperty({ default: 'lunezchanz' })
  username: string;

  @ApiProperty({ default: 'lunezchan123@' })
  password: string;

  @ApiProperty({ default: '0903234121' })
  phoneNumber?: string;
}
