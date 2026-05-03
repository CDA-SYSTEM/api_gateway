import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class CreateVehicleDto {
  @ApiProperty({ example: 'CLI-001', description: 'ID del cliente' })
  @IsString()
  @IsNotEmpty()
  clienteId: string;

  @ApiProperty({ example: 1, description: 'ID de la marca' })
  @IsNumber()
  @IsNotEmpty()
  marcaId: number;

  @ApiProperty({ example: 1, description: 'ID de la clase' })
  @IsNumber()
  @IsNotEmpty()
  claseId: number;

  @ApiProperty({ example: 1, description: 'ID de la línea' })
  @IsNumber()
  @IsNotEmpty()
  lineaId: number;

  @ApiProperty({ example: 1, description: 'ID del color' })
  @IsNumber()
  @IsNotEmpty()
  colorId: number;

  @ApiProperty({ example: 1, description: 'ID del tipo de vehículo' })
  @IsNumber()
  @IsNotEmpty()
  tipoVehiculoId: number;

  @ApiProperty({ example: 1, description: 'ID del tipo de combustible' })
  @IsNumber()
  @IsNotEmpty()
  tipoCombustibleId: number;

  @ApiProperty({ example: 1, description: 'ID del tipo de servicio' })
  @IsNumber()
  @IsNotEmpty()
  tipoServicioId: number;

  @ApiProperty({ example: '2024', description: 'Modelo del vehículo' })
  @IsString()
  @IsNotEmpty()
  modelo: string;

  @ApiProperty({ example: 'ABC123', description: 'Placa del vehículo' })
  @IsString()
  @IsNotEmpty()
  placa: string;

  @ApiProperty({ example: 'CERT-001', description: 'Número de certificado' })
  @IsString()
  @IsNotEmpty()
  certificadoNo: string;
}
