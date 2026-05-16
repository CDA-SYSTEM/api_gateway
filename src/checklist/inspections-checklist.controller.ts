import {
  Controller, Get, Post, Put, Patch, Delete, Body, Param, Query, Req, UsePipes, ValidationPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiResponse, ApiSecurity, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { InspectionsChecklistService } from './application/inspections-checklist.service';
import { CreateInspectionChecklistDto } from './application/dtos/create-inspection-checklist.dto';
import { UpdateInspectionChecklistDto } from './application/dtos/update-inspection-checklist.dto';
import { CloseInspectionChecklistDto } from './application/dtos/close-inspection-checklist.dto';
import { InspectionQueryDto } from './application/dtos/inspection-query.dto';
import type { Request } from 'express';

@ApiTags('checklist-inspections')
@Controller('api/v1/inspections')
@UsePipes(new ValidationPipe({ transform: true }))
@ApiSecurity('x-api-key')
@ApiBearerAuth()
export class InspectionsChecklistController {
  constructor(private readonly inspectionsService: InspectionsChecklistService) {}

  @Get()
  @ApiOperation({ summary: 'Listar inspecciones de checklist' })
  @ApiResponse({ status: 200, description: 'Lista de inspecciones' })
  list(@Req() req: Request) {
    const token = (req.headers['authorization'] as string)?.replace('Bearer ', '') ?? '';
    return this.inspectionsService.list(token);
  }

  @Post()
  @ApiOperation({ summary: 'Crear inspección de checklist' })
  @ApiBody({ type: CreateInspectionChecklistDto })
  @ApiResponse({ status: 201, description: 'Inspección creada en borrador' })
  create(@Body() body: CreateInspectionChecklistDto, @Req() req: Request) {
    const token = (req.headers['authorization'] as string)?.replace('Bearer ', '') ?? '';
    return this.inspectionsService.create(body, token);
  }

  @Get('by-plate/:plate')
  @ApiOperation({ summary: 'Buscar inspecciones por placa' })
  @ApiResponse({ status: 200, description: 'Inspecciones encontradas' })
  getByPlate(@Param('plate') plate: string, @Req() req: Request) {
    const token = (req.headers['authorization'] as string)?.replace('Bearer ', '') ?? '';
    return this.inspectionsService.getByPlate(plate, token);
  }

  @Get('by-date')
  @ApiOperation({ summary: 'Buscar inspecciones por rango de fechas' })
  @ApiQuery({ name: 'start', required: true, example: '2026-05-01T00:00:00Z' })
  @ApiQuery({ name: 'end', required: true, example: '2026-05-16T23:59:59Z' })
  @ApiResponse({ status: 200, description: 'Inspecciones encontradas' })
  getByDate(@Query() query: InspectionQueryDto, @Req() req: Request) {
    const token = (req.headers['authorization'] as string)?.replace('Bearer ', '') ?? '';
    return this.inspectionsService.getByDate(query.start!, query.end!, token);
  }

  @Get('by-status/:status')
  @ApiOperation({ summary: 'Buscar inspecciones por estado' })
  @ApiResponse({ status: 200, description: 'Inspecciones encontradas' })
  getByStatus(@Param('status') status: string, @Req() req: Request) {
    const token = (req.headers['authorization'] as string)?.replace('Bearer ', '') ?? '';
    return this.inspectionsService.getByStatus(status, token);
  }

  @Get('by-vehicle/:vehicleId')
  @ApiOperation({ summary: 'Buscar inspecciones por ID de vehículo' })
  @ApiResponse({ status: 200, description: 'Inspecciones encontradas' })
  getByVehicle(@Param('vehicleId') vehicleId: string, @Req() req: Request) {
    const token = (req.headers['authorization'] as string)?.replace('Bearer ', '') ?? '';
    return this.inspectionsService.getByVehicle(vehicleId, token);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener inspección por ID' })
  @ApiResponse({ status: 200, description: 'Inspección encontrada' })
  getById(@Param('id') id: string, @Req() req: Request) {
    const token = (req.headers['authorization'] as string)?.replace('Bearer ', '') ?? '';
    return this.inspectionsService.getById(id, token);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar inspección' })
  @ApiBody({ type: UpdateInspectionChecklistDto })
  @ApiResponse({ status: 200, description: 'Inspección actualizada' })
  update(@Param('id') id: string, @Body() body: UpdateInspectionChecklistDto, @Req() req: Request) {
    const token = (req.headers['authorization'] as string)?.replace('Bearer ', '') ?? '';
    return this.inspectionsService.update(id, body, token);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar inspección' })
  @ApiResponse({ status: 200, description: 'Inspección eliminada' })
  delete(@Param('id') id: string, @Req() req: Request) {
    const token = (req.headers['authorization'] as string)?.replace('Bearer ', '') ?? '';
    return this.inspectionsService.delete(id, token);
  }

  @Patch(':id/draft')
  @ApiOperation({ summary: 'Guardar inspección como borrador' })
  @ApiBody({ type: UpdateInspectionChecklistDto })
  @ApiResponse({ status: 200, description: 'Inspección guardada como borrador' })
  saveDraft(@Param('id') id: string, @Body() body: UpdateInspectionChecklistDto, @Req() req: Request) {
    const token = (req.headers['authorization'] as string)?.replace('Bearer ', '') ?? '';
    return this.inspectionsService.saveDraft(id, body, token);
  }

  @Patch(':id/in-progress')
  @ApiOperation({ summary: 'Marcar inspección en progreso' })
  @ApiBody({ type: UpdateInspectionChecklistDto })
  @ApiResponse({ status: 200, description: 'Inspección marcada en progreso' })
  markInProgress(@Param('id') id: string, @Body() body: UpdateInspectionChecklistDto, @Req() req: Request) {
    const token = (req.headers['authorization'] as string)?.replace('Bearer ', '') ?? '';
    return this.inspectionsService.markInProgress(id, body, token);
  }

  @Patch(':id/close')
  @ApiOperation({ summary: 'Cerrar inspección con resultado' })
  @ApiBody({ type: CloseInspectionChecklistDto })
  @ApiResponse({ status: 200, description: 'Inspección cerrada' })
  close(@Param('id') id: string, @Body() body: CloseInspectionChecklistDto, @Req() req: Request) {
    const token = (req.headers['authorization'] as string)?.replace('Bearer ', '') ?? '';
    return this.inspectionsService.close(id, body, token);
  }
}
