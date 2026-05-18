import { IsOptional, IsString, IsNumber, IsDateString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class SearchInspectionDto {
  @ApiPropertyOptional({ example: 1, description: 'Pagina actual' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number;

  @ApiPropertyOptional({ example: 20, description: 'Tamanio de pagina' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page_size?: number;

  @ApiPropertyOptional({ example: 'abc567', description: 'Placa del vehiculo' })
  @IsOptional()
  @IsString()
  plate?: string;

  @ApiPropertyOptional({ example: 'CERRADA', description: 'Estado de la inspeccion' })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({ example: 4, description: 'ID del vehiculo' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  vehicle_id?: number;

  @ApiPropertyOptional({ example: '2026-04-29', description: 'Fecha inicio (YYYY-MM-DD)' })
  @IsOptional()
  @IsString()
  start_date?: string;

  @ApiPropertyOptional({ example: '2026-04-30', description: 'Fecha fin (YYYY-MM-DD)' })
  @IsOptional()
  @IsString()
  end_date?: string;
}
