import { Controller, Get, Post, Put, Delete, Body, Param, Req, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiResponse, ApiSecurity, ApiBearerAuth } from '@nestjs/swagger';
import { CatalogsCrudService } from './application/catalogs-crud.service';
import { CreateCatalogoDto } from '../vehicle/application/dtos/create-catalogo.dto';
import { UpdateCatalogoDto } from '../vehicle/application/dtos/update-catalogo.dto';
import type { Request } from 'express';

@ApiTags('catalogs-crud')
@Controller('api/v1/catalogs')
@UsePipes(new ValidationPipe({ transform: true }))
@ApiSecurity('x-api-key')
@ApiBearerAuth()
export class CatalogsCrudController {
  constructor(private readonly catalogsCrudService: CatalogsCrudService) {}

  @Get(':type')
  @ApiOperation({ summary: 'Listar catálogo por tipo' })
  @ApiResponse({ status: 200, description: 'Lista de ítems del catálogo' })
  list(@Param('type') type: string, @Req() req: Request) {
    const token = (req.headers['authorization'] as string)?.replace('Bearer ', '') ?? '';
    return this.catalogsCrudService.list(type, token);
  }

  @Post(':type')
  @ApiOperation({ summary: 'Crear ítem de catálogo' })
  @ApiBody({ type: CreateCatalogoDto })
  @ApiResponse({ status: 201, description: 'Ítem creado' })
  create(@Param('type') type: string, @Body() body: CreateCatalogoDto, @Req() req: Request) {
    const token = (req.headers['authorization'] as string)?.replace('Bearer ', '') ?? '';
    return this.catalogsCrudService.create(type, body, token);
  }

  @Get(':type/:id')
  @ApiOperation({ summary: 'Obtener ítem de catálogo por ID' })
  @ApiResponse({ status: 200, description: 'Ítem encontrado' })
  getById(@Param('type') type: string, @Param('id') id: string, @Req() req: Request) {
    const token = (req.headers['authorization'] as string)?.replace('Bearer ', '') ?? '';
    return this.catalogsCrudService.getById(type, id, token);
  }

  @Put(':type/:id')
  @ApiOperation({ summary: 'Actualizar ítem de catálogo' })
  @ApiBody({ type: UpdateCatalogoDto })
  @ApiResponse({ status: 200, description: 'Ítem actualizado' })
  update(
    @Param('type') type: string,
    @Param('id') id: string,
    @Body() body: UpdateCatalogoDto,
    @Req() req: Request,
  ) {
    const token = (req.headers['authorization'] as string)?.replace('Bearer ', '') ?? '';
    return this.catalogsCrudService.update(type, id, body, token);
  }

  @Delete(':type/:id')
  @ApiOperation({ summary: 'Eliminar ítem de catálogo' })
  @ApiResponse({ status: 200, description: 'Ítem eliminado' })
  delete(@Param('type') type: string, @Param('id') id: string, @Req() req: Request) {
    const token = (req.headers['authorization'] as string)?.replace('Bearer ', '') ?? '';
    return this.catalogsCrudService.delete(type, id, token);
  }
}
