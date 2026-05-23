import { ApiPropertyOptional } from '@nestjs/swagger';
import { ChecklistDto, AxleDto, TireDto } from './create-inspection.dto';

export class UpdateInspectionDto {
  @ApiPropertyOptional({ example: 1000, description: 'Kilometraje' })
  mileage?: number;

  @ApiPropertyOptional({ example: '1', description: 'ID del cliente' })
  client_id?: string;

  @ApiPropertyOptional({ example: '1', description: 'ID del vehículo' })
  vehicle_id?: string;

  @ApiPropertyOptional({ example: 'MOTOCICLETA_2_TIEMPOS', description: 'Tipo de vehículo' })
  vehicle_type?: string;

  @ApiPropertyOptional({ example: 'GASOLINA', description: 'Tipo de combustible' })
  fuel_type?: string;

  @ApiPropertyOptional({ example: 'CERT-12345', description: 'Número de certificado' })
  fuel_certificate_number?: string;

  @ApiPropertyOptional({ example: 'PARTICULAR', description: 'Tipo de servicio' })
  service_type?: string;

  @ApiPropertyOptional({ example: '1', description: 'ID del operador' })
  operator_id?: string;

  @ApiPropertyOptional({ example: 'PROPIETARIO', description: 'Tipo de cliente' })
  customer_type?: string;

  @ApiPropertyOptional({ example: 'TECNICO_MECANICA', description: 'Tipo de revisión' })
  revision_type?: string;

  @ApiPropertyOptional({ example: 'SI', description: 'Vidrios polarizados' })
  tinted_windows?: string;

  @ApiPropertyOptional({ example: 'SI', description: 'Vehículo blindado' })
  armored_vehicle?: string;

  @ApiPropertyOptional({ example: 'BUEN_ESTADO', description: 'Estado del depósito de líquido de frenos' })
  brake_fluid_sight_glass?: string;

  @ApiPropertyOptional({ example: 'string', description: 'Observaciones' })
  observations?: string;

  @ApiPropertyOptional({ example: 'https://ejemplo.com/firma.png', description: 'URL de la firma' })
  signature_url?: string;

  @ApiPropertyOptional({ example: 'https://ejemplo.com/foto.png', description: 'URL de la foto de recepción' })
  photo_reception_url?: string;

  @ApiPropertyOptional({ example: 'clh123abc', description: 'ID del checklist asociado' })
  checklistId?: string;

  @ApiPropertyOptional({ type: ChecklistDto, description: 'Checklist de inspección' })
  checklist?: ChecklistDto;

  @ApiPropertyOptional({ type: [AxleDto], description: 'Ejes del vehículo' })
  axles?: AxleDto[];

  @ApiPropertyOptional({ type: [TireDto], description: 'Llantas inspeccionadas' })
  tires?: TireDto[];
}
