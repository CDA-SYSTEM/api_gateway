import { Controller, Get, Req, UsePipes, ValidationPipe, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiSecurity, ApiBearerAuth } from '@nestjs/swagger';
import { VehicleService } from './application/vehicle.service';
import type { Request } from 'express';

@ApiTags('vehicle')
@Controller('api/v1')
@UsePipes(new ValidationPipe({ transform: true }))
@ApiSecurity('x-api-key')
@ApiBearerAuth()
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}

  @Get('health')
  @ApiOperation({ summary: 'Health check del servicio de vehículos' })
  @ApiResponse({ status: 200, description: 'Servicio disponible' })
  async healthCheck(@Req() req: Request) {
    const token = (req.headers['authorization'] as string)?.replace('Bearer ', '') ?? '';
    return this.vehicleService.healthCheck(token);
  }

  @Get('vehiculo/:id')
  @ApiOperation({ summary: 'Obtener vehículo por ID' })
  @ApiResponse({ status: 200, description: 'Vehículo encontrado' })
  async getVehicleById(@Param('id') id: string, @Req() req: Request) {
    const token = (req.headers['authorization'] as string)?.replace('Bearer ', '') ?? '';
    return this.vehicleService.getVehicleById(id, token);
  }
}
