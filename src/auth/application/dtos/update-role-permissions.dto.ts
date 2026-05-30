import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateRoleDto {
  @ApiProperty({ example: 'Control Total del Sistema', description: 'Nuevo nombre/alcance del rol' })
  @IsString()
  @IsOptional()
  scope?: string;

  @ApiProperty({ example: 'Gestion de usuarios, configuracion global, auditoria completa.', description: 'Nueva descripcion de permisos del rol' })
  @IsString()
  @IsOptional()
  permissions?: string;
}
