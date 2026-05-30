import { Controller, Get, Post, Patch, Delete, Param, Query, Body, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse, ApiSecurity, ApiBearerAuth } from '@nestjs/swagger';
import { InvoiceService } from './application/invoice.service';
import { Roles } from '../common/decorators/roles.decorator';
import { Roles as RoleConst } from '../common/constants/roles.constant';
import type { Request } from 'express';

@ApiTags('invoice')
@Controller('api/v1/invoices')
@ApiSecurity('x-api-key')
@ApiBearerAuth()
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una factura (genera número auto, calcula subtotal+IVA+total)' })
  @ApiResponse({ status: 201, description: 'Factura creada' })
  create(@Body() data: any, @Req() req: Request) {
    const token = (req.headers['authorization'] as string)?.replace('Bearer ', '') ?? '';
    return this.invoiceService.create(data, token);
  }

  @Get()
  @ApiOperation({ summary: 'Listar facturas con filtros opcionales' })
  @ApiQuery({ name: 'invoice_number', required: false, type: String })
  @ApiQuery({ name: 'statusId', required: false, type: String })
  @ApiQuery({ name: 'inspection_id', required: false, type: String })
  @ApiQuery({ name: 'includeDeleted', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'size', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Lista de facturas' })
  findAll(
    @Query('invoice_number') invoiceNumber: string,
    @Query('statusId') statusId: string,
    @Query('inspection_id') inspectionId: string,
    @Query('includeDeleted') includeDeleted: string,
    @Query('page') page: number,
    @Query('size') size: number,
    @Req() req: Request,
  ) {
    const token = (req.headers['authorization'] as string)?.replace('Bearer ', '') ?? '';
    return this.invoiceService.findAll(token, invoiceNumber, statusId, inspectionId, includeDeleted, page, size);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener factura por ID' })
  @ApiResponse({ status: 200, description: 'Factura encontrada' })
  findOne(@Param('id') id: string, @Req() req: Request) {
    const token = (req.headers['authorization'] as string)?.replace('Bearer ', '') ?? '';
    return this.invoiceService.findOne(id, token);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar factura (recalcula totales si cambian items)' })
  @ApiResponse({ status: 200, description: 'Factura actualizada' })
  update(@Param('id') id: string, @Body() data: any, @Req() req: Request) {
    const token = (req.headers['authorization'] as string)?.replace('Bearer ', '') ?? '';
    return this.invoiceService.update(id, data, token);
  }

  @Roles(RoleConst.ADMIN)
  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar factura (soft delete) - solo admin' })
  @ApiResponse({ status: 200, description: 'Factura eliminada' })
  remove(@Param('id') id: string, @Req() req: Request) {
    const token = (req.headers['authorization'] as string)?.replace('Bearer ', '') ?? '';
    return this.invoiceService.remove(id, token);
  }
}
