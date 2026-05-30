import { Controller, Get, Post, Patch, Delete, Param, Query, Body, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse, ApiSecurity, ApiBearerAuth } from '@nestjs/swagger';
import { PriceService } from './application/price.service';
import type { Request } from 'express';

@ApiTags('price')
@Controller('api/v1/prices')
@ApiSecurity('x-api-key')
@ApiBearerAuth()
export class PriceController {
  constructor(private readonly priceService: PriceService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un precio' })
  @ApiResponse({ status: 201, description: 'Precio creado' })
  create(@Body() data: any, @Req() req: Request) {
    const token = (req.headers['authorization'] as string)?.replace('Bearer ', '') ?? '';
    return this.priceService.create(data, token);
  }

  @Get()
  @ApiOperation({ summary: 'Listar precios con filtros opcionales' })
  @ApiQuery({ name: 'vehicleType', required: false, type: String })
  @ApiQuery({ name: 'revisionType', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Lista de precios' })
  findAll(
    @Query('vehicleType') vehicleType: string,
    @Query('revisionType') revisionType: string,
    @Req() req: Request,
  ) {
    const token = (req.headers['authorization'] as string)?.replace('Bearer ', '') ?? '';
    return this.priceService.findAll(token, vehicleType, revisionType);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener precio por ID' })
  @ApiResponse({ status: 200, description: 'Precio encontrado' })
  findOne(@Param('id') id: string, @Req() req: Request) {
    const token = (req.headers['authorization'] as string)?.replace('Bearer ', '') ?? '';
    return this.priceService.findOne(id, token);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar precio' })
  @ApiResponse({ status: 200, description: 'Precio actualizado' })
  update(@Param('id') id: string, @Body() data: any, @Req() req: Request) {
    const token = (req.headers['authorization'] as string)?.replace('Bearer ', '') ?? '';
    return this.priceService.update(id, data, token);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar precio (soft delete)' })
  @ApiResponse({ status: 200, description: 'Precio eliminado' })
  remove(@Param('id') id: string, @Req() req: Request) {
    const token = (req.headers['authorization'] as string)?.replace('Bearer ', '') ?? '';
    return this.priceService.remove(id, token);
  }
}
