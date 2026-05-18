import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsIn, IsNotEmpty } from 'class-validator';

export class RegisterPersonnelDto {
  @ApiProperty({ example: 'cc', description: 'Tipo de identificación' })
  @IsString()
  @IsNotEmpty()
  identificationType: string;

  @ApiProperty({ example: '11223344', description: 'Número de identificación' })
  @IsString()
  @IsNotEmpty()
  identificationNumber: string;

  @ApiProperty({ example: 'Laura', description: 'Nombres' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Inspectora', description: 'Apellidos' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ example: '3001234567', description: 'Número de teléfono' })
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty({ example: 'laura@example.com', description: 'Email' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'inspector', enum: ['admin', 'manager', 'inspector', 'operario'] })
  @IsString()
  @IsNotEmpty()
  @IsIn(['admin', 'manager', 'inspector', 'operario'])
  role: string;
}
