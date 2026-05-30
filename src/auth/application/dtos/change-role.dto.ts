import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class UpdateUserRoleDto {
  @ApiProperty({ example: 'inspector', description: 'Nuevo rol del usuario', enum: ['superadmin', 'admin', 'manager', 'operario', 'inspector'] })
  @IsString()
  @IsNotEmpty()
  role: string;
}
