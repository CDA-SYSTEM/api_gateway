import { IsOptional, IsString, IsIn } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class TemplateQueryDto {
  @ApiPropertyOptional({ enum: ['MOTO', 'LIVIANO', 'PESADO'], example: 'MOTO' })
  @IsOptional()
  @IsString()
  @IsIn(['MOTO', 'LIVIANO', 'PESADO'])
  vehicle_type?: string;
}
