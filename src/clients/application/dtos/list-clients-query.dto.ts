import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class ListClientsQueryDto {
  @ApiPropertyOptional({ example: 'Pérez', description: 'Texto de búsqueda' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ example: 1, description: 'ID del tipo de documento' })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  documentTypeId?: number;

  @ApiPropertyOptional({ example: 1, description: 'ID del tipo de persona' })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  personTypeId?: number;

  @ApiPropertyOptional({ example: 0, description: 'Número de página (empieza en 0)', default: 0 })
  @IsInt()
  @Min(0)
  @Type(() => Number)
  page: number = 0;

  @ApiPropertyOptional({ example: 10, description: 'Tamaño de página', default: 10 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  size: number = 10;
}
