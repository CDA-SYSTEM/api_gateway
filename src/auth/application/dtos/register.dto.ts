import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, MinLength, IsIn, IsNotEmpty } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'cc', description: 'Tipo de identificación' })
  @IsString()
  @IsNotEmpty()
  identificationType: string;

  @ApiProperty({ example: '11223344', description: 'Número de identificación' })
  @IsString()
  @IsNotEmpty()
  identificationNumber: string;

  @ApiProperty({ example: 'Juan', description: 'Nombres' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Pérez', description: 'Apellidos' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ example: '3001234567', description: 'Número de teléfono' })
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty({ example: 'juan@example.com', description: 'Email' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'Password123!', description: 'Contraseña' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'inspector', enum: ['admin', 'manager', 'inspector', 'operario'] })
  @IsString()
  @IsNotEmpty()
  @IsIn(['admin', 'manager', 'inspector', 'operario'])
  role: string;
}
