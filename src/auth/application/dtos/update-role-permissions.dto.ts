import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';

export class UpdateRolePermissionsDto {
  @ApiProperty({ example: ['users:read', 'users:write'], description: 'Permisos del rol' })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  permissions?: string[];

  @ApiProperty({ example: 'all', description: 'Alcance del rol' })
  @IsString()
  @IsOptional()
  scope?: string;
}
