import { Controller, Get, Put, Post, Delete, Body, Param, Req, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiResponse, ApiSecurity, ApiBearerAuth } from '@nestjs/swagger';
import { VehicleService } from './application/vehicle.service';
import { CreateCatalogoDto } from './application/dtos/create-catalogo.dto';
import { UpdateCatalogoDto } from './application/dtos/update-catalogo.dto';
import { UpdateVehicleDto } from './application/dtos/update-vehicle.dto';
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

  @Put('vehiculo/:id')
  @ApiOperation({ summary: 'Actualizar vehículo' })
  @ApiBody({ type: UpdateVehicleDto })
  @ApiResponse({ status: 200, description: 'Vehículo actualizado' })
  async updateVehicle(
    @Param('id') id: string,
    @Body() body: UpdateVehicleDto,
    @Req() req: Request,
  ) {
    const token = (req.headers['authorization'] as string)?.replace('Bearer ', '') ?? '';
    return this.vehicleService.updateVehicle(id, body, token);
  }

  // Marcas
  @Post('marca')
  @ApiOperation({ summary: 'Crear marca' })
  @ApiBody({ type: CreateCatalogoDto })
  @ApiResponse({ status: 201, description: 'Marca creada' })
  async createMarca(@Body() body: CreateCatalogoDto, @Req() req: Request) {
    const token = (req.headers['authorization'] as string)?.replace('Bearer ', '') ?? '';
    return this.vehicleService.createMarca(body, token);
  }

  @Get('marca')
  @ApiOperation({ summary: 'Listar marcas' })
  @ApiResponse({ status: 200, description: 'Lista de marcas' })
  async listMarcas(@Req() req: Request) {
    const token = (req.headers['authorization'] as string)?.replace('Bearer ', '') ?? '';
    return this.vehicleService.listMarcas(token);
  }

  @Get('marca/:id')
  @ApiOperation({ summary: 'Obtener marca por ID' })
  @ApiResponse({ status: 200, description: 'Marca encontrada' })
  async getMarcaById(@Param('id') id: string, @Req() req: Request) {
    const token = (req.headers['authorization'] as string)?.replace('Bearer ', '') ?? '';
    return this.vehicleService.getMarcaById(id, token);
  }

  @Put('marca/:id')
  @ApiOperation({ summary: 'Actualizar marca' })
  @ApiBody({ type: UpdateCatalogoDto })
  @ApiResponse({ status: 200, description: 'Marca actualizada' })
  async updateMarca(@Param('id') id: string, @Body() body: UpdateCatalogoDto, @Req() req: Request) {
    const token = (req.headers['authorization'] as string)?.replace('Bearer ', '') ?? '';
    return this.vehicleService.updateMarca(id, body, token);
  }

  @Delete('marca/:id')
  @ApiOperation({ summary: 'Eliminar marca' })
  @ApiResponse({ status: 200, description: 'Marca eliminada' })
  async deleteMarca(@Param('id') id: string, @Req() req: Request) {
    const token = (req.headers['authorization'] as string)?.replace('Bearer ', '') ?? '';
    return this.vehicleService.deleteMarca(id, token);
  }

  // Clases
  @Post('clase')
  @ApiOperation({ summary: 'Crear clase' })
  @ApiBody({ type: CreateCatalogoDto })
  @ApiResponse({ status: 201, description: 'Clase creada' })
  async createClase(@Body() body: CreateCatalogoDto, @Req() req: Request) {
    const token = (req.headers['authorization'] as string)?.replace('Bearer ', '') ?? '';
    return this.vehicleService.createClase(body, token);
  }

  @Get('clase')
  @ApiOperation({ summary: 'Listar clases' })
  @ApiResponse({ status: 200, description: 'Lista de clases' })
  async listClases(@Req() req: Request) {
    const token = (req.headers['authorization'] as string)?.replace('Bearer ', '') ?? '';
    return this.vehicleService.listClases(token);
  }

  @Get('clase/:id')
  @ApiOperation({ summary: 'Obtener clase por ID' })
  @ApiResponse({ status: 200, description: 'Clase encontrada' })
  async getClaseById(@Param('id') id: string, @Req() req: Request) {
    const token = (req.headers['authorization'] as string)?.replace('Bearer ', '') ?? '';
    return this.vehicleService.getClaseById(id, token);
  }

  @Put('clase/:id')
  @ApiOperation({ summary: 'Actualizar clase' })
  @ApiBody({ type: UpdateCatalogoDto })
  @ApiResponse({ status: 200, description: 'Clase actualizada' })
  async updateClase(@Param('id') id: string, @Body() body: UpdateCatalogoDto, @Req() req: Request) {
    const token = (req.headers['authorization'] as string)?.replace('Bearer ', '') ?? '';
    return this.vehicleService.updateClase(id, body, token);
  }

  @Delete('clase/:id')
  @ApiOperation({ summary: 'Eliminar clase' })
  @ApiResponse({ status: 200, description: 'Clase eliminada' })
  async deleteClase(@Param('id') id: string, @Req() req: Request) {
    const token = (req.headers['authorization'] as string)?.replace('Bearer ', '') ?? '';
    return this.vehicleService.deleteClase(id, token);
  }

  // Líneas
  @Post('linea')
  @ApiOperation({ summary: 'Crear línea' })
  @ApiBody({ type: CreateCatalogoDto })
  @ApiResponse({ status: 201, description: 'Línea creada' })
  async createLinea(@Body() body: CreateCatalogoDto, @Req() req: Request) {
    const token = (req.headers['authorization'] as string)?.replace('Bearer ', '') ?? '';
    return this.vehicleService.createLinea(body, token);
  }

  @Get('linea')
  @ApiOperation({ summary: 'Listar líneas' })
  @ApiResponse({ status: 200, description: 'Lista de líneas' })
  async listLineas(@Req() req: Request) {
    const token = (req.headers['authorization'] as string)?.replace('Bearer ', '') ?? '';
    return this.vehicleService.listLineas(token);
  }

  @Get('linea/:id')
  @ApiOperation({ summary: 'Obtener línea por ID' })
  @ApiResponse({ status: 200, description: 'Línea encontrada' })
  async getLineaById(@Param('id') id: string, @Req() req: Request) {
    const token = (req.headers['authorization'] as string)?.replace('Bearer ', '') ?? '';
    return this.vehicleService.getLineaById(id, token);
  }

  @Put('linea/:id')
  @ApiOperation({ summary: 'Actualizar línea' })
  @ApiBody({ type: UpdateCatalogoDto })
  @ApiResponse({ status: 200, description: 'Línea actualizada' })
  async updateLinea(@Param('id') id: string, @Body() body: UpdateCatalogoDto, @Req() req: Request) {
    const token = (req.headers['authorization'] as string)?.replace('Bearer ', '') ?? '';
    return this.vehicleService.updateLinea(id, body, token);
  }

  @Delete('linea/:id')
  @ApiOperation({ summary: 'Eliminar línea' })
  @ApiResponse({ status: 200, description: 'Línea eliminada' })
  async deleteLinea(@Param('id') id: string, @Req() req: Request) {
    const token = (req.headers['authorization'] as string)?.replace('Bearer ', '') ?? '';
    return this.vehicleService.deleteLinea(id, token);
  }

  // Colores
  @Post('color')
  @ApiOperation({ summary: 'Crear color' })
  @ApiBody({ type: CreateCatalogoDto })
  @ApiResponse({ status: 201, description: 'Color creado' })
  async createColor(@Body() body: CreateCatalogoDto, @Req() req: Request) {
    const token = (req.headers['authorization'] as string)?.replace('Bearer ', '') ?? '';
    return this.vehicleService.createColor(body, token);
  }

  @Get('color')
  @ApiOperation({ summary: 'Listar colores' })
  @ApiResponse({ status: 200, description: 'Lista de colores' })
  async listColores(@Req() req: Request) {
    const token = (req.headers['authorization'] as string)?.replace('Bearer ', '') ?? '';
    return this.vehicleService.listColores(token);
  }

  @Get('color/:id')
  @ApiOperation({ summary: 'Obtener color por ID' })
  @ApiResponse({ status: 200, description: 'Color encontrado' })
  async getColorById(@Param('id') id: string, @Req() req: Request) {
    const token = (req.headers['authorization'] as string)?.replace('Bearer ', '') ?? '';
    return this.vehicleService.getColorById(id, token);
  }

  @Put('color/:id')
  @ApiOperation({ summary: 'Actualizar color' })
  @ApiBody({ type: UpdateCatalogoDto })
  @ApiResponse({ status: 200, description: 'Color actualizado' })
  async updateColor(@Param('id') id: string, @Body() body: UpdateCatalogoDto, @Req() req: Request) {
    const token = (req.headers['authorization'] as string)?.replace('Bearer ', '') ?? '';
    return this.vehicleService.updateColor(id, body, token);
  }

  @Delete('color/:id')
  @ApiOperation({ summary: 'Eliminar color' })
  @ApiResponse({ status: 200, description: 'Color eliminado' })
  async deleteColor(@Param('id') id: string, @Req() req: Request) {
    const token = (req.headers['authorization'] as string)?.replace('Bearer ', '') ?? '';
    return this.vehicleService.deleteColor(id, token);
  }

  // Tipos de Vehículo
  @Post('tipo-vehiculo')
  @ApiOperation({ summary: 'Crear tipo de vehículo' })
  @ApiBody({ type: CreateCatalogoDto })
  @ApiResponse({ status: 201, description: 'Tipo de vehículo creado' })
  async createTipoVehiculo(@Body() body: CreateCatalogoDto, @Req() req: Request) {
    const token = (req.headers['authorization'] as string)?.replace('Bearer ', '') ?? '';
    return this.vehicleService.createTipoVehiculo(body, token);
  }

  @Get('tipo-vehiculo')
  @ApiOperation({ summary: 'Listar tipos de vehículo' })
  @ApiResponse({ status: 200, description: 'Lista de tipos de vehículo' })
  async listTiposVehiculo(@Req() req: Request) {
    const token = (req.headers['authorization'] as string)?.replace('Bearer ', '') ?? '';
    return this.vehicleService.listTiposVehiculo(token);
  }

  @Get('tipo-vehiculo/:id')
  @ApiOperation({ summary: 'Obtener tipo de vehículo por ID' })
  @ApiResponse({ status: 200, description: 'Tipo de vehículo encontrado' })
  async getTipoVehiculoById(@Param('id') id: string, @Req() req: Request) {
    const token = (req.headers['authorization'] as string)?.replace('Bearer ', '') ?? '';
    return this.vehicleService.getTipoVehiculoById(id, token);
  }

  @Put('tipo-vehiculo/:id')
  @ApiOperation({ summary: 'Actualizar tipo de vehículo' })
  @ApiBody({ type: UpdateCatalogoDto })
  @ApiResponse({ status: 200, description: 'Tipo de vehículo actualizado' })
  async updateTipoVehiculo(@Param('id') id: string, @Body() body: UpdateCatalogoDto, @Req() req: Request) {
    const token = (req.headers['authorization'] as string)?.replace('Bearer ', '') ?? '';
    return this.vehicleService.updateTipoVehiculo(id, body, token);
  }

  @Delete('tipo-vehiculo/:id')
  @ApiOperation({ summary: 'Eliminar tipo de vehículo' })
  @ApiResponse({ status: 200, description: 'Tipo de vehículo eliminado' })
  async deleteTipoVehiculo(@Param('id') id: string, @Req() req: Request) {
    const token = (req.headers['authorization'] as string)?.replace('Bearer ', '') ?? '';
    return this.vehicleService.deleteTipoVehiculo(id, token);
  }
}
