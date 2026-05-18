import { IsString, IsOptional, IsNumber, IsIn, IsArray, ValidateNested, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { InspectionItemResponseDto } from './create-inspection-checklist.dto';

export class UpdateInspectionChecklistDto {
  @ApiPropertyOptional({ example: 'ABC123' })
  @IsOptional()
  @IsString()
  plate?: string;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsNumber()
  vehicle_id?: number;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsNumber()
  client_id?: number;

  @ApiPropertyOptional({ enum: ['MOTO', 'LIVIANO', 'PESADO'] })
  @IsOptional()
  @IsString()
  @IsIn(['MOTO', 'LIVIANO', 'PESADO'])
  vehicle_type?: string;

  @ApiPropertyOptional({ example: '69f4fc2d4c2e0f7722a7e2ba' })
  @IsOptional()
  @IsString()
  template_id?: string;

  @ApiPropertyOptional({ example: '2026-05-16T10:00:00Z' })
  @IsOptional()
  @IsDateString()
  inspection_datetime?: string;

  @ApiPropertyOptional({ example: 'usr_001' })
  @IsOptional()
  @IsString()
  inspector_id?: string;

  @ApiPropertyOptional({ type: [InspectionItemResponseDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InspectionItemResponseDto)
  responses?: InspectionItemResponseDto[];

  @ApiPropertyOptional({ example: 'Observaciones generales' })
  @IsOptional()
  @IsString()
  observations?: string;
}
