import { Controller, Get, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiSecurity, ApiBearerAuth } from '@nestjs/swagger';
import { ClientsApplicationService } from './application/clients.service';
import type { Request } from 'express';

@ApiTags('clients')
@Controller('api/v1')
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
}
