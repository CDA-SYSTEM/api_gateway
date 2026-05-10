import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CatalogsService } from './application/catalogs.service';

@ApiTags('catalogs')
@Controller('api/v1/catalogs')
export class CatalogsController {
  constructor(private readonly catalogsService: CatalogsService) {}

  @Get('vehicle-types')
  @ApiOperation({ summary: 'Listar tipos de vehículo' })
  @ApiResponse({ status: 200, description: 'Tipos de vehículo' })
  getVehicleTypes() {
    return this.catalogsService.getVehicleTypes();
  }

  @Get('fuel-types')
  @ApiOperation({ summary: 'Listar tipos de combustible' })
  @ApiResponse({ status: 200, description: 'Tipos de combustible' })
  getFuelTypes() {
    return this.catalogsService.getFuelTypes();
  }

  @Get('service-types')
  @ApiOperation({ summary: 'Listar tipos de servicio' })
  @ApiResponse({ status: 200, description: 'Tipos de servicio' })
  getServiceTypes() {
    return this.catalogsService.getServiceTypes();
  }

  @Get('tire-positions')
  @ApiOperation({ summary: 'Listar posiciones de llantas' })
  @ApiResponse({ status: 200, description: 'Posiciones de llantas' })
  getTirePositions() {
    return this.catalogsService.getTirePositions();
  }

  @Get('ternary-choices')
  @ApiOperation({ summary: 'Listar opciones ternarias (Sí/No/No Aplica)' })
  @ApiResponse({ status: 200, description: 'Opciones ternarias' })
  getTernaryChoices() {
    return this.catalogsService.getTernaryChoices();
  }

  @Get('revision-types')
  @ApiOperation({ summary: 'Listar tipos de revisión' })
  @ApiResponse({ status: 200, description: 'Tipos de revisión' })
  getRevisionTypes() {
    return this.catalogsService.getRevisionTypes();
  }

  @Get('brake-fluid-sight-glasses')
  @ApiOperation({ summary: 'Listar estados del depósito de líquido de frenos' })
  @ApiResponse({ status: 200, description: 'Estados del depósito' })
  getBrakeFluidSightGlasses() {
    return this.catalogsService.getBrakeFluidSightGlasses();
  }

  @Get('customer-types')
  @ApiOperation({ summary: 'Listar tipos de cliente' })
  @ApiResponse({ status: 200, description: 'Tipos de cliente' })
  getCustomerTypes() {
    return this.catalogsService.getCustomerTypes();
  }
}
