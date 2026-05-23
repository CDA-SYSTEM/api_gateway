import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ChecklistDto {
  @ApiProperty({ example: true, description: 'Confirma limpieza del vehículo' })
  is_clean: boolean;

  @ApiPropertyOptional({ example: true, description: 'Indica si se retiraron copas/tapas' })
  hubcaps_removed?: boolean;

  @ApiPropertyOptional({ example: true, description: 'Indica si las alarmas están desactivadas' })
  alarms_off?: boolean;

  @ApiPropertyOptional({ example: true, description: 'Confirma que el vehículo está descargado' })
  is_unloaded?: boolean;

  @ApiPropertyOptional({ example: 0, description: 'Cantidad de asientos de servicio público visibles' })
  public_service_seats?: number;

  @ApiPropertyOptional({ example: true, description: 'Confirma que los cinturones sean visibles' })
  seatbelts_visible?: boolean;
}

export class AxleDto {
  @ApiProperty({ example: 1, description: 'Número de eje. Debe iniciar en 1' })
  index: number;

  @ApiProperty({ example: 'DELANTERO', description: 'Tipo de eje' })
  axle_type: string;
}

export class TireDto {
  @ApiProperty({ example: 'FRONT_LEFT', description: 'Posición de la llanta' })
  position: string;

  @ApiProperty({ example: 'MXA12345', description: 'Código o serial de la llanta' })
  code: string;

  @ApiProperty({ example: 32.5, description: 'Presión de la llanta en PSI' })
  tire_pressure: number;
}

export class CreateInspectionDto {
  @ApiProperty({ example: 1000, description: 'Kilometraje' })
  mileage: number;

  @ApiProperty({ example: '1', description: 'ID del cliente' })
  client_id: string;

  @ApiProperty({ example: '1', description: 'ID del vehículo' })
  vehicle_id: string;

  @ApiPropertyOptional({ example: 'MOTOCICLETA_2_TIEMPOS', description: 'Tipo de vehículo' })
  vehicle_type?: string;

  @ApiPropertyOptional({ example: 'GASOLINA', description: 'Tipo de combustible' })
  fuel_type?: string;

  @ApiPropertyOptional({ example: 'CERT-12345', description: 'Número de certificado' })
  fuel_certificate_number?: string;

  @ApiPropertyOptional({ example: 'PARTICULAR', description: 'Tipo de servicio' })
  service_type?: string;

  @ApiProperty({ example: '1', description: 'ID del operador' })
  operator_id: string;

  @ApiProperty({ example: 'PROPIETARIO', description: 'Tipo de cliente' })
  customer_type: string;

  @ApiProperty({ example: 'TECNICO_MECANICA', description: 'Tipo de revisión' })
  revision_type: string;

  @ApiProperty({ example: 'SI', description: 'Vidrios polarizados' })
  tinted_windows: string;

  @ApiProperty({ example: 'SI', description: 'Vehículo blindado' })
  armored_vehicle: string;

  @ApiProperty({ example: 'BUEN_ESTADO', description: 'Estado del depósito de líquido de frenos' })
  brake_fluid_sight_glass: string;

  @ApiPropertyOptional({ example: 'string', description: 'Observaciones' })
  observations?: string;

  @ApiPropertyOptional({ example: 'https://ejemplo.com/firma.png', description: 'URL de la firma' })
  signature_url?: string;

  @ApiProperty({ example: 'https://ejemplo.com/foto.png', description: 'URL de la foto de recepción' })
  photo_reception_url?: string;

  @ApiPropertyOptional({ example: 'clh123abc', description: 'ID del checklist asociado' })
  checklistId?: string;

  @ApiProperty({ type: ChecklistDto, description: 'Checklist de inspección' })
  checklist: ChecklistDto;

  @ApiProperty({ type: [AxleDto], description: 'Ejes del vehículo' })
  axles: AxleDto[];

  @ApiProperty({ type: [TireDto], description: 'Llantas inspeccionadas' })
  tires: TireDto[];
}
