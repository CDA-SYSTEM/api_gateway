import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateCatalogoDto {
  @ApiProperty({ example: 'Toyota', description: 'Nombre del elemento' })
  @IsString()
  @IsNotEmpty()
  nombre: string;
}
