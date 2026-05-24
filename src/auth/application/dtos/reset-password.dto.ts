import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @ApiProperty({ example: 'NuevaClave123!', description: 'Nueva contraseña para la cuenta' })
  newPassword: string;
}
