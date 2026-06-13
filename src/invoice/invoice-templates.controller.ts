import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiSecurity, ApiBearerAuth } from '@nestjs/swagger';
import { InvoiceInfrastructureService } from '../invoice/infrastructure/invoice.service';
import type { Request } from 'express';

@ApiTags('invoice-templates')
@Controller('api/v1/invoice-templates')
@ApiSecurity('x-api-key')
@ApiBearerAuth()
export class InvoiceTemplatesController {
  constructor(private readonly infrastructure: InvoiceInfrastructureService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva plantilla' })
  create(@Body() data: any, @Req() req: Request) {
    const token = (req.headers['authorization'] as string)?.replace('Bearer ', '') ?? '';
    return this.infrastructure.proxyRequest('POST', '/api/invoice-templates', data, {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas las plantillas' })
  findAll(@Query('typeCode') typeCode: string, @Req() req: Request) {
    const token = (req.headers['authorization'] as string)?.replace('Bearer ', '') ?? '';
    return this.infrastructure.proxyRequest('GET', `/api/invoice-templates${typeCode ? '?typeCode=' + typeCode : ''}`, null, {
      Authorization: `Bearer ${token}`,
    });
  }

  @Get('active/:typeCode')
  @ApiOperation({ summary: 'Obtener la plantilla activa por tipo' })
  findActive(@Param('typeCode') typeCode: string, @Req() req: Request) {
    const token = (req.headers['authorization'] as string)?.replace('Bearer ', '') ?? '';
    return this.infrastructure.proxyRequest('GET', `/api/invoice-templates/active/${typeCode}`, null, {
      Authorization: `Bearer ${token}`,
    });
  }

  @Get('meta/types')
  @ApiOperation({ summary: 'Listar tipos de plantillas disponibles' })
  findAllTypes(@Req() req: Request) {
    const token = (req.headers['authorization'] as string)?.replace('Bearer ', '') ?? '';
    return this.infrastructure.proxyRequest('GET', '/api/invoice-templates/meta/types', null, {
      Authorization: `Bearer ${token}`,
    });
  }

  @Get('meta/variables')
  @ApiOperation({ summary: 'Listar variables disponibles para las plantillas' })
  findAllVariables(@Query('category') category: string, @Req() req: Request) {
    const token = (req.headers['authorization'] as string)?.replace('Bearer ', '') ?? '';
    return this.infrastructure.proxyRequest('GET', `/api/invoice-templates/meta/variables${category ? '?category=' + category : ''}`, null, {
      Authorization: `Bearer ${token}`,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una plantilla por ID' })
  findOne(@Param('id') id: string, @Req() req: Request) {
    const token = (req.headers['authorization'] as string)?.replace('Bearer ', '') ?? '';
    return this.infrastructure.proxyRequest('GET', `/api/invoice-templates/${id}`, null, {
      Authorization: `Bearer ${token}`,
    });
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una plantilla' })
  update(@Param('id') id: string, @Body() data: any, @Req() req: Request) {
    const token = (req.headers['authorization'] as string)?.replace('Bearer ', '') ?? '';
    return this.infrastructure.proxyRequest('PATCH', `/api/invoice-templates/${id}`, data, {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  @Patch(':id/activate')
  @ApiOperation({ summary: 'Activar una plantilla' })
  activate(@Param('id') id: string, @Req() req: Request) {
    const token = (req.headers['authorization'] as string)?.replace('Bearer ', '') ?? '';
    return this.infrastructure.proxyRequest('PATCH', `/api/invoice-templates/${id}/activate`, null, {
      Authorization: `Bearer ${token}`,
    });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una plantilla' })
  remove(@Param('id') id: string, @Req() req: Request) {
    const token = (req.headers['authorization'] as string)?.replace('Bearer ', '') ?? '';
    return this.infrastructure.proxyRequest('DELETE', `/api/invoice-templates/${id}`, null, {
      Authorization: `Bearer ${token}`,
    });
  }
}
