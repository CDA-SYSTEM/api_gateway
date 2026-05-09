import { Controller, Get, Put, Body, Param, Req, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBody, ApiResponse, ApiSecurity, ApiBearerAuth } from '@nestjs/swagger';
import { ClientsApplicationService } from './application/clients.service';
import { UpdateClientDto } from './application/dtos/update-client.dto';
import type { Request } from 'express';

@ApiTags('clients')
@Controller('api/v1')
@ApiSecurity('x-api-key')
@ApiBearerAuth()
export class ClientsController {
  constructor(private readonly clientsService: ClientsApplicationService) {}

  @Put('clients/:id')
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiOperation({ summary: 'Actualizar cliente' })
  @ApiParam({ name: 'id', description: 'ID del cliente' })
  @ApiBody({ type: UpdateClientDto })
  @ApiResponse({ status: 200, description: 'Cliente actualizado' })
  @ApiResponse({ status: 404, description: 'Cliente no encontrado' })
  async updateClient(@Param('id') id: string, @Body() body: UpdateClientDto, @Req() req: Request) {
    const token = (req.headers['authorization'] as string)?.replace('Bearer ', '') ?? '';
    return this.clientsService.updateClient(id, body, token);
  }

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
