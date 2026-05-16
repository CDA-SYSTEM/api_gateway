import { IsString, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CloseInspectionChecklistDto {
  @ApiProperty({ enum: ['APROBADO', 'RECHAZADO'], example: 'APROBADO' })
  @IsString()
  @IsIn(['APROBADO', 'RECHAZADO'])
  general_result: string;
}
