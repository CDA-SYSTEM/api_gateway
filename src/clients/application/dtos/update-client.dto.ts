import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsNotEmpty, IsDateString } from 'class-validator';

export class UpdateClientDto {
  @ApiProperty({ example: 'Juan', description: 'Nombre del cliente' })
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiProperty({ example: 'Pérez', description: 'Apellido del cliente' })
  @IsString()
  @IsNotEmpty()
  apellido: string;

  @ApiProperty({ example: '2026-05-09', description: 'Fecha de nacimiento' })
  @IsDateString()
  @IsNotEmpty()
  birthDate: string;

  @ApiProperty({ example: '123456789', description: 'Número de identificación' })
  @IsString()
  @IsNotEmpty()
  identity: string;

  @ApiProperty({ example: 'Calle 123 #45-67', description: 'Dirección del cliente' })
  @IsString()
  @IsNotEmpty()
  direccion: string;

  @ApiProperty({ example: '3001234567', description: 'Número de celular' })
  @IsString()
  @IsNotEmpty()
  celular: string;

  @ApiProperty({ example: 'juan@example.com', description: 'Correo electrónico' })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 1, description: 'ID del tipo de documento' })
  @IsNumber()
  @IsNotEmpty()
  documentTypeId: number;

  @ApiProperty({ example: 1, description: 'ID del tipo de persona' })
  @IsNumber()
  @IsNotEmpty()
  personTypeId: number;
}
