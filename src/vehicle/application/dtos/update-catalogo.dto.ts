import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class UpdateCatalogoDto {
  @ApiProperty({ example: 'Toyota Actualizado', description: 'Nombre del elemento' })
  @IsString()
  @IsNotEmpty()
  nombre: string;
}
