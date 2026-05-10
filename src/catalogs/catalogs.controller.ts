import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  VEHICLE_TYPES,
  FUEL_TYPES,
  SERVICE_TYPES,
  TIRE_POSITIONS,
  TERNARY_CHOICES,
  REVISION_TYPES,
  BRAKE_FLUID_SIGHT_GLASSES,
  CUSTOMER_TYPES,
  AXLE_TYPES,
} from './catalogs.data';

@ApiTags('catalogs')
@Controller('api/v1/catalogs')
export class CatalogsController {
  @Get('vehicle-types')
  @ApiOperation({ summary: 'Listar tipos de vehículo' })
  @ApiResponse({ status: 200, description: 'Tipos de vehículo' })
  getVehicleTypes() {
    return VEHICLE_TYPES;
  }

  @Get('fuel-types')
  @ApiOperation({ summary: 'Listar tipos de combustible' })
  @ApiResponse({ status: 200, description: 'Tipos de combustible' })
  getFuelTypes() {
    return FUEL_TYPES;
  }

  @Get('service-types')
  @ApiOperation({ summary: 'Listar tipos de servicio' })
  @ApiResponse({ status: 200, description: 'Tipos de servicio' })
  getServiceTypes() {
    return SERVICE_TYPES;
  }

  @Get('tire-positions')
  @ApiOperation({ summary: 'Listar posiciones de llantas' })
  @ApiResponse({ status: 200, description: 'Posiciones de llantas' })
  getTirePositions() {
    return TIRE_POSITIONS;
  }

  @Get('ternary-choices')
  @ApiOperation({ summary: 'Listar opciones ternarias (Sí/No/No Aplica)' })
  @ApiResponse({ status: 200, description: 'Opciones ternarias' })
  getTernaryChoices() {
    return TERNARY_CHOICES;
  }

  @Get('revision-types')
  @ApiOperation({ summary: 'Listar tipos de revisión' })
  @ApiResponse({ status: 200, description: 'Tipos de revisión' })
  getRevisionTypes() {
    return REVISION_TYPES;
  }

  @Get('brake-fluid-sight-glasses')
  @ApiOperation({ summary: 'Listar estados del depósito de líquido de frenos' })
  @ApiResponse({ status: 200, description: 'Estados del depósito' })
  getBrakeFluidSightGlasses() {
    return BRAKE_FLUID_SIGHT_GLASSES;
  }

  @Get('customer-types')
  @ApiOperation({ summary: 'Listar tipos de cliente' })
  @ApiResponse({ status: 200, description: 'Tipos de cliente' })
  getCustomerTypes() {
    return CUSTOMER_TYPES;
  }

  @Get('axle-types')
  @ApiOperation({ summary: 'Listar tipos de eje' })
  @ApiResponse({ status: 200, description: 'Tipos de eje' })
  getAxleTypes() {
    return AXLE_TYPES;
  }
}
