import { Controller, Get, Param, Req } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiResponse, ApiSecurity, ApiBearerAuth } from '@nestjs/swagger';
import type { Request } from 'express';
import { TrackerApplicationService } from './application/tracker.service';
import { Roles } from '../common/decorators/roles.decorator';
import { Roles as RoleConstants } from '../common/constants/roles.constant';

@ApiTags('Tracker - Grafo CDA')
@Controller('api/v1/tracker')
@ApiSecurity('x-api-key')
@ApiBearerAuth()
export class TrackerController {
  constructor(private readonly trackerService: TrackerApplicationService) {}

  @Get('clientes')
  @Roles(RoleConstants.ADMIN, RoleConstants.MANAGER, RoleConstants.SUPERADMIN)
  @ApiOperation({ summary: 'Listar todos los clientes del grafo' })
  listClients(@Req() req: Request) {
    const token = (req.headers['authorization'] as string)?.replace('Bearer ', '') ?? '';
    return this.trackerService.listClients(token);
  }

  @Get('clientes/:clienteId')
  @Roles(RoleConstants.ADMIN, RoleConstants.MANAGER, RoleConstants.SUPERADMIN)
  @ApiOperation({ summary: 'Obtener cliente del grafo por ID' })
  getClientById(@Param('clienteId') clienteId: string, @Req() req: Request) {
    const token = (req.headers['authorization'] as string)?.replace('Bearer ', '') ?? '';
    return this.trackerService.getClientById(clienteId, token);
  }

  @Get('clientes/:clienteId/vehiculos')
  @Roles(RoleConstants.ADMIN, RoleConstants.MANAGER, RoleConstants.SUPERADMIN)
  @ApiOperation({ summary: 'Listar vehículos de un cliente en el grafo' })
  listVehiclesByClient(@Param('clienteId') clienteId: string, @Req() req: Request) {
    const token = (req.headers['authorization'] as string)?.replace('Bearer ', '') ?? '';
    return this.trackerService.listVehiclesByClient(clienteId, token);
  }

  @Get('vehiculos')
  @Roles(RoleConstants.ADMIN, RoleConstants.MANAGER, RoleConstants.SUPERADMIN)
  @ApiOperation({ summary: 'Listar todos los vehículos del grafo' })
  listVehicles(@Req() req: Request) {
    const token = (req.headers['authorization'] as string)?.replace('Bearer ', '') ?? '';
    return this.trackerService.listVehicles(token);
  }

  @Get('vehiculos/:placa')
  @Roles(RoleConstants.ADMIN, RoleConstants.MANAGER, RoleConstants.SUPERADMIN)
  @ApiOperation({ summary: 'Obtener vehículo del grafo por placa' })
  getVehicleByPlate(@Param('placa') placa: string, @Req() req: Request) {
    const token = (req.headers['authorization'] as string)?.replace('Bearer ', '') ?? '';
    return this.trackerService.getVehicleByPlate(placa, token);
  }

  @Get('vehiculos/:placa/planillas')
  @Roles(RoleConstants.ADMIN, RoleConstants.MANAGER, RoleConstants.SUPERADMIN)
  @ApiOperation({ summary: 'Listar planillas de un vehículo' })
  listPlanillasByVehicle(@Param('placa') placa: string, @Req() req: Request) {
    const token = (req.headers['authorization'] as string)?.replace('Bearer ', '') ?? '';
    return this.trackerService.listPlanillasByVehicle(placa, token);
  }

  @Get('planillas')
  @Roles(RoleConstants.ADMIN, RoleConstants.MANAGER, RoleConstants.SUPERADMIN)
  @ApiOperation({ summary: 'Listar todas las planillas de inspección' })
  listPlanillas(@Req() req: Request) {
    const token = (req.headers['authorization'] as string)?.replace('Bearer ', '') ?? '';
    return this.trackerService.listPlanillas(token);
  }

  @Get('planillas/:planillaId')
  @Roles(RoleConstants.ADMIN, RoleConstants.MANAGER, RoleConstants.SUPERADMIN)
  @ApiOperation({ summary: 'Obtener planilla con sus defectos' })
  getPlanillaById(@Param('planillaId') planillaId: string, @Req() req: Request) {
    const token = (req.headers['authorization'] as string)?.replace('Bearer ', '') ?? '';
    return this.trackerService.getPlanillaById(planillaId, token);
  }

  @Get('stats')
  @Roles(RoleConstants.ADMIN, RoleConstants.MANAGER, RoleConstants.SUPERADMIN)
  @ApiOperation({ summary: 'Estadísticas globales del grafo' })
  getStats(@Req() req: Request) {
    const token = (req.headers['authorization'] as string)?.replace('Bearer ', '') ?? '';
    return this.trackerService.getStats(token);
  }

  @Get('dashboard')
  @Roles(RoleConstants.ADMIN, RoleConstants.MANAGER, RoleConstants.SUPERADMIN)
  @ApiOperation({ summary: 'Dashboard completo del grafo (forkJoin paralelo)' })
  getFullDashboard(@Req() req: Request) {
    const token = (req.headers['authorization'] as string)?.replace('Bearer ', '') ?? '';
    return this.trackerService.getFullDashboard(token);
  }
}
