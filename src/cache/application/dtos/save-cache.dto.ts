import { IsString, IsNumber, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SaveCacheDto {
  @ApiProperty({ example: 'vehicles:list:active', description: 'Clave unica para identificar el cache' })
  @IsString()
  @IsNotEmpty()
  key: string;

  @ApiProperty({ description: 'Valor a cachear (objeto o array)' })
  @IsNotEmpty()
  value: any;

  @ApiProperty({ example: 60, description: 'Tiempo de vida en segundos' })
  @IsNumber()
  ttlSeconds: number;
}
