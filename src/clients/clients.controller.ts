import { Controller, Get, Param, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiResponse, ApiSecurity, ApiBearerAuth } from '@nestjs/swagger';
import { ClientsApplicationService } from './application/clients.service';
import type { Request } from 'express';

@ApiTags('clients')
@Controller()
@ApiSecurity('x-api-key')
@ApiBearerAuth()
export class ClientsController {
  constructor(private readonly clientsService: ClientsApplicationService) {}

  @Get('clients/health')
  @ApiOperation({ summary: 'Health check del servicio de clientes' })
  @ApiResponse({ status: 200, description: 'Servicio disponible' })
  async healthCheck(@Req() req: Request) {
    const token = (req.headers['authorization'] as string)?.replace('Bearer ', '') ?? '';
    return this.clientsService.healthCheck(token);
  }

  @Get('clients/:id')
  @ApiOperation({ summary: 'Obtener cliente por ID' })
  @ApiParam({ name: 'id', description: 'ID del cliente' })
  @ApiResponse({ status: 200, description: 'Cliente encontrado' })
  @ApiResponse({ status: 404, description: 'Cliente no encontrado' })
  async getClientById(@Param('id') id: string, @Req() req: Request) {
    const token = (req.headers['authorization'] as string)?.replace('Bearer ', '') ?? '';
    return this.clientsService.getClientById(id, token);
  }
}
