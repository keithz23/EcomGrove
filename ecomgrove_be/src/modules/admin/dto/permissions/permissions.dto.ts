import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';

export class AssignPermissionDto {
  @ApiProperty()
  @IsString()
  roleId: string;

  @ApiProperty()
  @IsArray()
  permissionsId: string[];
}
