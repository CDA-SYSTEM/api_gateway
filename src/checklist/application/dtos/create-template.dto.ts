import { IsString, IsBoolean, IsArray, IsOptional, IsNumber, Min, IsIn, ValidateNested, Matches } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class TemplateItemDto {
  @ApiProperty({ example: '6.1.1.1', maxLength: 100 })
  @IsString()
  code: string;

  @ApiProperty({ example: 'Inexistencia o mal funcionamiento de los limpiaparabrisas delanteros.' })
  @IsString()
  description: string;

  @ApiProperty({ enum: ['A', 'B'], example: 'A' })
  @IsString()
  @IsIn(['A', 'B'])
  defect_type: string;

  @ApiPropertyOptional({ example: '' })
  @IsOptional()
  @IsString()
  observation?: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  order: number;
}

class TemplateSubsectionDto {
  @ApiPropertyOptional({ example: '6.1.2' })
  @IsOptional()
  @IsString()
  code?: string;

  @ApiPropertyOptional({ example: 'Limpiaparabrisas' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  order: number;

  @ApiProperty({ type: [TemplateItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TemplateItemDto)
  items: TemplateItemDto[];
}

class TemplateSectionDto {
  @ApiPropertyOptional({ example: '6.1' })
  @IsOptional()
  @IsString()
  code?: string;

  @ApiProperty({ example: 'ACONDICIONAMIENTO EXTERIOR' })
  @IsString()
  title: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  order: number;

  @ApiProperty({ type: [TemplateSubsectionDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TemplateSubsectionDto)
  subsections: TemplateSubsectionDto[];
}

export class CreateTemplateDto {
  @ApiProperty({ enum: ['MOTOS', 'LIVIANOS_PESADOS'], example: 'LIVIANOS_PESADOS' })
  @IsString()
  @IsIn(['MOTOS', 'LIVIANOS_PESADOS'])
  code: string;

  @ApiProperty({ example: 'Plantilla Livianos y Pesados 2026' })
  @IsString()
  @Matches(/.*[a-zA-Z].*/, { message: 'El nombre debe contener al menos una letra' })
  name: string;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  version?: number;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @ApiProperty({ example: ['LIVIANO', 'PESADO'] })
  @IsArray()
  @IsString({ each: true })
  @IsIn(['MOTO', 'LIVIANO', 'PESADO'], { each: true })
  supported_vehicle_types: string[];

  @ApiProperty({ type: [TemplateSectionDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TemplateSectionDto)
  sections: TemplateSectionDto[];
}
