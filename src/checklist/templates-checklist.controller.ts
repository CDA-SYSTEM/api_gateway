import {
  Controller, Get, Post, Put, Delete, Body, Param, Query, Req, UsePipes, ValidationPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiResponse, ApiSecurity, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { TemplatesChecklistService } from './application/templates-checklist.service';
import { CreateTemplateDto } from './application/dtos/create-template.dto';
import { UpdateTemplateDto } from './application/dtos/update-template.dto';
import { TemplateQueryDto } from './application/dtos/template-query.dto';
import type { Request } from 'express';

@ApiTags('checklist-templates')
@Controller('api/v1/templates')
@UsePipes(new ValidationPipe({ transform: true }))
@ApiSecurity('x-api-key')
@ApiBearerAuth()
export class TemplatesChecklistController {
  constructor(private readonly templatesService: TemplatesChecklistService) {}

  @Get()
  @ApiOperation({ summary: 'Listar plantillas de checklist' })
  @ApiQuery({ name: 'vehicle_type', required: false, enum: ['MOTO', 'LIVIANO', 'PESADO'] })
  @ApiResponse({ status: 200, description: 'Lista de plantillas' })
  list(@Query() query: TemplateQueryDto, @Req() req: Request) {
    const token = (req.headers['authorization'] as string)?.replace('Bearer ', '') ?? '';
    return this.templatesService.list(query.vehicle_type, token);
  }

  @Post()
  @ApiOperation({ summary: 'Crear plantilla de checklist' })
  @ApiBody({ type: CreateTemplateDto })
  @ApiResponse({ status: 201, description: 'Plantilla creada' })
  create(@Body() body: CreateTemplateDto, @Req() req: Request) {
    const token = (req.headers['authorization'] as string)?.replace('Bearer ', '') ?? '';
    return this.templatesService.create(body, token);
  }

  @Get('motos')
  @ApiOperation({ summary: 'Obtener plantilla activa para motos' })
  @ApiResponse({ status: 200, description: 'Plantilla de motos' })
  getActiveMotos(@Req() req: Request) {
    const token = (req.headers['authorization'] as string)?.replace('Bearer ', '') ?? '';
    return this.templatesService.getActiveMotoTemplate(token);
  }

  @Get('livianos-pesados')
  @ApiOperation({ summary: 'Obtener plantilla activa para livianos y pesados' })
  @ApiResponse({ status: 200, description: 'Plantilla de livianos/pesados' })
  getActiveLivianosPesados(@Req() req: Request) {
    const token = (req.headers['authorization'] as string)?.replace('Bearer ', '') ?? '';
    return this.templatesService.getActiveLivianosPesadosTemplate(token);
  }

  @Get('active/:vehicleType')
  @ApiOperation({ summary: 'Obtener plantilla activa por tipo de vehículo' })
  @ApiResponse({ status: 200, description: 'Plantilla activa encontrada' })
  getActiveByVehicleType(@Param('vehicleType') vehicleType: string, @Req() req: Request) {
    const token = (req.headers['authorization'] as string)?.replace('Bearer ', '') ?? '';
    return this.templatesService.getActiveByVehicleType(vehicleType, token);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener plantilla por ID' })
  @ApiResponse({ status: 200, description: 'Plantilla encontrada' })
  getById(@Param('id') id: string, @Req() req: Request) {
    const token = (req.headers['authorization'] as string)?.replace('Bearer ', '') ?? '';
    return this.templatesService.getById(id, token);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar plantilla' })
  @ApiBody({ type: UpdateTemplateDto })
  @ApiResponse({ status: 200, description: 'Plantilla actualizada' })
  update(@Param('id') id: string, @Body() body: UpdateTemplateDto, @Req() req: Request) {
    const token = (req.headers['authorization'] as string)?.replace('Bearer ', '') ?? '';
    return this.templatesService.update(id, body, token);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar plantilla' })
  @ApiResponse({ status: 200, description: 'Plantilla eliminada' })
  delete(@Param('id') id: string, @Req() req: Request) {
    const token = (req.headers['authorization'] as string)?.replace('Bearer ', '') ?? '';
    return this.templatesService.delete(id, token);
  }
}
