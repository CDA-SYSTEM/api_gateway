import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
  @ApiProperty({ example: '1234', description: 'Contraseña actual del usuario' })
  currentPassword: string;

  @ApiProperty({ example: 'NuevaClave123!', description: 'Nueva contraseña' })
  newPassword: string;
}
