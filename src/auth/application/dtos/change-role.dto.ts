import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class ChangeRoleDto {
  @ApiProperty({ example: 'inspector', description: 'Nuevo rol del usuario' })
  @IsString()
  @IsNotEmpty()
  role: string;
}
