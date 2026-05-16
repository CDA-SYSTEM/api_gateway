import { IsString, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CloseInspectionChecklistDto {
  @ApiProperty({ enum: ['APROBADO', 'RECHAZADO'], example: 'APROBADO', description: 'Resultado general de la inspección' })
  @IsString()
  @IsIn(['APROBADO', 'RECHAZADO'])
  general_result: string;
}
