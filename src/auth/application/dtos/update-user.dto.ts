import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsIn } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ example: 'Pérez Actualizado', required: false })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({ example: '3009990001', required: false })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiProperty({ example: 'inspector', enum: ['admin', 'manager', 'inspector', 'operario'], required: false })
  @IsOptional()
  @IsString()
  @IsIn(['admin', 'manager', 'inspector', 'operario'])
  role?: string;
}
