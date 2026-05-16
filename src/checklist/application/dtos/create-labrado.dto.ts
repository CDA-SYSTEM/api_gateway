import { IsString, IsArray, ValidateNested, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class TireMeasurementDto {
  @ApiProperty({ example: 'TIRE-001' })
  @IsString()
  tire_code: string;

  @ApiProperty({ example: 5.0, minimum: 0 })
  @IsNumber()
  @Min(0)
  outer_mm: number;

  @ApiProperty({ example: 4.5, minimum: 0 })
  @IsNumber()
  @Min(0)
  middle_mm: number;

  @ApiProperty({ example: 4.0, minimum: 0 })
  @IsNumber()
  @Min(0)
  inner_mm: number;
}

class WheelMeasurementDto {
  @ApiProperty({ example: 'WHEEL-001' })
  @IsString()
  wheel_code: string;

  @ApiProperty({ type: [TireMeasurementDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TireMeasurementDto)
  tires: TireMeasurementDto[];
}

class AxleMeasurementDto {
  @ApiProperty({ example: 'AXLE-001' })
  @IsString()
  axle_code: string;

  @ApiProperty({ type: [WheelMeasurementDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WheelMeasurementDto)
  wheels: WheelMeasurementDto[];
}

export class CreateLabradoDto {
  @ApiProperty({ example: 'inspection-id' })
  @IsString()
  inspection_id: string;

  @ApiProperty({ type: [AxleMeasurementDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AxleMeasurementDto)
  axles: AxleMeasurementDto[];
}
