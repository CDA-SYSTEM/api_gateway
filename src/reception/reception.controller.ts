import { Controller, Get, Post, Put, Delete, Body, Param, Query, Req, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiParam, ApiQuery, ApiResponse, ApiSecurity, ApiBearerAuth } from '@nestjs/swagger';
import { ReceptionService } from './application/reception.service';
import type { Request } from 'express';

@ApiTags('reception')
@Controller('api/v1')
@UsePipes(new ValidationPipe({ transform: true }))
@ApiSecurity('x-api-key')
@ApiBearerAuth()
export class ReceptionController {
  constructor(private readonly receptionService: ReceptionService) {}

  @Get('reception')
  @ApiOperation({ summary: 'Listar recepciones' })
  @ApiResponse({ status: 200, description: 'Lista de recepciones' })
  list(@Req() req: Request) {
    const token = (req.headers['authorization'] as string)?.replace('Bearer ', '') ?? '';
    return this.receptionService.list(token);
  }

  @Get('reception/:id')
  @ApiOperation({ summary: 'Obtener recepción por ID' })
  @ApiParam({ name: 'id', required: true, type: String, description: 'ID de la recepción' })
  @ApiResponse({ status: 200, description: 'Recepción encontrada' })
  getById(@Param('id') id: string, @Req() req: Request) {
    const token = (req.headers['authorization'] as string)?.replace('Bearer ', '') ?? '';
    return this.receptionService.getById(id, token);
  }

  @Post('reception')
  @ApiOperation({ summary: 'Crear recepción' })
  @ApiBody({ description: 'Datos de la recepción' })
  @ApiResponse({ status: 201, description: 'Recepción creada' })
  create(@Body() body: any, @Req() req: Request) {
    const token = (req.headers['authorization'] as string)?.replace('Bearer ', '') ?? '';
    return this.receptionService.create(body, token);
  }

  @Put('reception/:id')
  @ApiOperation({ summary: 'Actualizar recepción' })
  @ApiParam({ name: 'id', required: true, type: String, description: 'ID de la recepción' })
  @ApiBody({ description: 'Datos actualizados de la recepción' })
  @ApiResponse({ status: 200, description: 'Recepción actualizada' })
  update(@Param('id') id: string, @Body() body: any, @Req() req: Request) {
    const token = (req.headers['authorization'] as string)?.replace('Bearer ', '') ?? '';
    return this.receptionService.update(id, body, token);
  }

  @Delete('reception/:id')
  @ApiOperation({ summary: 'Eliminar recepción' })
  @ApiParam({ name: 'id', required: true, type: String, description: 'ID de la recepción' })
  @ApiResponse({ status: 200, description: 'Recepción eliminada' })
  delete(@Param('id') id: string, @Req() req: Request) {
    const token = (req.headers['authorization'] as string)?.replace('Bearer ', '') ?? '';
    return this.receptionService.delete(id, token);
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
