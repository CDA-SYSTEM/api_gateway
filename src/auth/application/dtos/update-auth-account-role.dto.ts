import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class UpdateAuthAccountRoleDto {
  @ApiProperty({ example: 'admin', description: 'Nuevo rol de la cuenta de autenticacion', enum: ['superadmin', 'admin', 'manager', 'operario', 'inspector'] })
  @IsString()
  @IsNotEmpty()
  role!: string;
}
