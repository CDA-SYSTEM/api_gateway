import { Controller, Get, Query, Req, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse, ApiSecurity, ApiBearerAuth } from '@nestjs/swagger';
import { ReceptionService } from './application/reception.service';
import type { Request } from 'express';

@ApiTags('reception')
@Controller('api')
@UsePipes(new ValidationPipe({ transform: true }))
@ApiSecurity('x-api-key')
@ApiBearerAuth()
export class ReceptionController {
  constructor(private readonly receptionService: ReceptionService) {}

  @Get('/')
  @ApiOperation({ summary: 'Health check del servicio de recepción' })
  @ApiResponse({ status: 200, description: 'Servicio disponible' })
  healthCheck(@Req() req: Request) {
    const token = (req.headers['authorization'] as string)?.replace('Bearer ', '') ?? '';
    return this.receptionService.healthCheck(token);
  }

  @Get('inspections')
  @ApiOperation({ summary: 'Listar inspecciones con filtros opcionales y paginación' })
  @ApiQuery({ name: 'includeDeleted', required: false, type: String, description: 'Incluye registros con soft delete' })
  @ApiQuery({ name: 'inspection_number', required: false, type: String, description: 'Filtrar por número de inspección' })
  @ApiQuery({ name: 'vehicle_id', required: false, type: String, description: 'Filtrar por placa del vehículo' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Número de página (empieza en 1)' })
  @ApiQuery({ name: 'size', required: false, type: Number, description: 'Elementos por página' })
  @ApiResponse({ status: 200, description: 'Lista de inspecciones' })
  listInspections(
    @Query('includeDeleted') includeDeleted: string,
    @Query('inspection_number') inspectionNumber: string,
    @Query('vehicle_id') vehicleId: string,
    @Query('page') page: number,
    @Query('size') size: number,
    @Req() req: Request,
  ) {
    const token = (req.headers['authorization'] as string)?.replace('Bearer ', '') ?? '';
    return this.receptionService.listInspections(token, includeDeleted, inspectionNumber, vehicleId, page, size);
  }
}
