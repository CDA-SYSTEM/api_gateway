import { Controller, Get, Post, Patch, Delete, Param, Query, Body, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse, ApiSecurity, ApiBearerAuth } from '@nestjs/swagger';
import { StatusService } from './application/status.service';
import type { Request } from 'express';

@ApiTags('status')
@Controller('api/v1/statuses')
@ApiSecurity('x-api-key')
@ApiBearerAuth()
export class StatusController {
  constructor(private readonly statusService: StatusService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un estado' })
  @ApiResponse({ status: 201, description: 'Estado creado' })
  create(@Body() data: any, @Req() req: Request) {
    const token = (req.headers['authorization'] as string)?.replace('Bearer ', '') ?? '';
    return this.statusService.create(data, token);
  }

  @Get()
  @ApiOperation({ summary: 'Listar estados con filtro opcional por code y paginación' })
  @ApiQuery({ name: 'code', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'size', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Lista de estados' })
  findAll(
    @Query('code') code: string,
    @Query('page') page: number,
    @Query('size') size: number,
    @Req() req: Request,
  ) {
    const token = (req.headers['authorization'] as string)?.replace('Bearer ', '') ?? '';
    return this.statusService.findAll(token, code, page, size);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener estado por ID' })
  @ApiResponse({ status: 200, description: 'Estado encontrado' })
  findOne(@Param('id') id: string, @Req() req: Request) {
    const token = (req.headers['authorization'] as string)?.replace('Bearer ', '') ?? '';
    return this.statusService.findOne(id, token);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar estado' })
  @ApiResponse({ status: 200, description: 'Estado actualizado' })
  update(@Param('id') id: string, @Body() data: any, @Req() req: Request) {
    const token = (req.headers['authorization'] as string)?.replace('Bearer ', '') ?? '';
    return this.statusService.update(id, data, token);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar estado (soft delete)' })
  @ApiResponse({ status: 200, description: 'Estado eliminado' })
  remove(@Param('id') id: string, @Req() req: Request) {
    const token = (req.headers['authorization'] as string)?.replace('Bearer ', '') ?? '';
    return this.statusService.remove(id, token);
  }
}
