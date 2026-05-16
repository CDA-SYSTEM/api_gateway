import { IsString, IsOptional, IsNumber, IsIn, IsArray, ValidateNested, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class InspectionItemResponseDto {
  @ApiProperty({ example: 'section-code' })
  @IsString()
  section_code: string;

  @ApiProperty({ example: 'subsection-code' })
  @IsString()
  subsection_code: string;

  @ApiProperty({ example: 'item-code' })
  @IsString()
  item_code: string;

  @ApiProperty({ example: 'APROBADO' })
  @IsString()
  response: string;

  @ApiPropertyOptional({ enum: ['A', 'B'], example: 'A' })
  @IsOptional()
  @IsString()
  @IsIn(['A', 'B'])
  defect_type?: string;

  @ApiPropertyOptional({ example: '' })
  @IsOptional()
  @IsString()
  observation?: string;
}

export class CreateInspectionChecklistDto {
  @ApiProperty({ example: 'ABC123' })
  @IsString()
  plate: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  vehicle_id: number;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsNumber()
  client_id?: number;

  @ApiProperty({ enum: ['MOTO', 'LIVIANO', 'PESADO'], example: 'LIVIANO' })
  @IsString()
  @IsIn(['MOTO', 'LIVIANO', 'PESADO'])
  vehicle_type: string;

  @ApiPropertyOptional({ example: 'template-id' })
  @IsOptional()
  @IsString()
  template_id?: string;

  @ApiPropertyOptional({ example: '2026-05-16T10:00:00Z' })
  @IsOptional()
  @IsDateString()
  inspection_datetime?: string;

  @ApiProperty({ example: 'user-id' })
  @IsString()
  inspector_id: string;

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
