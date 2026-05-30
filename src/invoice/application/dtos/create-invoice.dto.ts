import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class InvoiceClientDto {
  @ApiProperty({ example: '1234567890', description: 'Documento del cliente' })
  document: string;

  @ApiProperty({ example: 'Carlos Perez', description: 'Nombre del cliente' })
  name: string;

  @ApiPropertyOptional({ example: 'Calle 123 #45-67' })
  address?: string;

  @ApiPropertyOptional({ example: '3001234567' })
  phone?: string;

  @ApiPropertyOptional({ example: 'carlos@email.com' })
  email?: string;
}

export class InvoiceItemDto {
  @ApiProperty({ example: 'Revisión TECNICO_MECANICA - LIVIANO', description: 'Concepto' })
  concept: string;

  @ApiProperty({ example: 1, description: 'Cantidad' })
  quantity: number;

  @ApiProperty({ example: 150000, description: 'Precio unitario' })
  unitPrice: number;
}

export class CreateInvoiceDto {
  @ApiProperty({ type: InvoiceClientDto, description: 'Datos del cliente' })
  client: InvoiceClientDto;

  @ApiProperty({ type: [InvoiceItemDto], description: 'Items/conceptos de la factura' })
  items: InvoiceItemDto[];

  @ApiProperty({ example: 'STATUS_ID', description: 'ID del estado (PENDING)' })
  statusId: string;

  @ApiProperty({ example: 'INSPECTION_ID', description: 'ID de la inspección relacionada' })
  inspection_id: string;

  @ApiPropertyOptional({ description: 'Observaciones' })
  observations?: string;
}
