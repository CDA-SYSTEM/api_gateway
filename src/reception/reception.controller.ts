import { Controller, Delete, Get, Param, Patch, Post, Query, Req, Body, UploadedFiles, UseInterceptors, UsePipes, ValidationPipe, BadRequestException } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse, ApiConsumes, ApiBody, ApiSecurity, ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from '../common/decorators/roles.decorator';
import { Roles as RoleConst } from '../common/constants/roles.constant';
import { ReceptionService } from './application/reception.service';
import { CreateInspectionDto } from './application/dtos/create-inspection.dto';
import { UpdateInspectionDto } from './application/dtos/update-inspection.dto';
import type { Request } from 'express';

@ApiTags('reception')
@Controller('api/v1')
@UsePipes(new ValidationPipe({ transform: true }))
@ApiSecurity('x-api-key')
@ApiBearerAuth()
export class ReceptionController {
  constructor(private readonly receptionService: ReceptionService) {}

  @Get('/')
  @ApiOperation({ summary: 'Health check del servicio de recepción' })
  @ApiResponse({ status: 200, description: 'Servicio disponible' })
  healthCheck(@Req() req: Request) {
    const token = (req.headers['authorization'] as string)?.replace('Bearer ', '') ?? '';
    return this.receptionService.healthCheck(token);
  }

  @Get('inspections')
  @ApiOperation({ summary: 'Listar inspecciones con filtros opcionales y paginación' })
  @ApiQuery({ name: 'includeDeleted', required: false, type: String, description: 'Incluye registros con soft delete' })
  @ApiQuery({ name: 'inspection_number', required: false, type: String, description: 'Filtrar por número de inspección' })
  @ApiQuery({ name: 'vehicle_id', required: false, type: String, description: 'Filtrar por placa del vehículo' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Número de página (empieza en 1)' })
  @ApiQuery({ name: 'size', required: false, type: Number, description: 'Elementos por página' })
  @ApiResponse({ status: 200, description: 'Lista de inspecciones' })
  listInspections(
    @Query('includeDeleted') includeDeleted: string,
    @Query('inspection_number') inspectionNumber: string,
    @Query('vehicle_id') vehicleId: string,
    @Query('page') page: number,
    @Query('size') size: number,
    @Req() req: Request,
  ) {
    const token = (req.headers['authorization'] as string)?.replace('Bearer ', '') ?? '';
    return this.receptionService.listInspections(token, includeDeleted, inspectionNumber, vehicleId, page, size);
  }

  @Get('inspections/:id')
  @ApiOperation({ summary: 'Obtener inspección por ID con datos de cliente, vehículo y operador' })
  @ApiResponse({ status: 200, description: 'Inspección encontrada' })
  getInspectionById(@Param('id') id: string, @Req() req: Request) {
    const token = (req.headers['authorization'] as string)?.replace('Bearer ', '') ?? '';
    return this.receptionService.getInspectionById(id, token);
  }

  @Roles(RoleConst.ADMIN)
  @Delete('inspections/:id')
  @ApiOperation({ summary: 'Eliminar (soft delete) inspección por ID (solo admin)' })
  @ApiResponse({ status: 200, description: 'Inspección eliminada' })
  deleteInspection(@Param('id') id: string, @Req() req: Request) {
    const token = (req.headers['authorization'] as string)?.replace('Bearer ', '') ?? '';
    return this.receptionService.deleteInspectionById(id, token);
  }

  @Post('inspections')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'signature', maxCount: 1 },
    { name: 'photo', maxCount: 1 },
  ]))
  @ApiOperation({ summary: 'Crear una inspección con imágenes' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['data', 'photo'],
      properties: {
        data: {
          type: 'string',
          description: 'Datos de la inspección en formato JSON',
          example: '{"mileage":1000,"client_id":"1","vehicle_id":"1","operator_id":"1","customer_type":"PROPIETARIO","revision_type":"TECNICO_MECANICA","tinted_windows":"SI","armored_vehicle":"SI","brake_fluid_sight_glass":"BUEN_ESTADO","checklist":{"is_clean":true},"axles":[{"index":1,"axle_type":"DELANTERO"}],"tires":[{"position":"FRONT_LEFT","code":"MXA12345","tire_pressure":32.5}]}',
        },
        signature: {
          type: 'string',
          format: 'binary',
          description: 'Archivo de firma (opcional)',
        },
        photo: {
          type: 'string',
          format: 'binary',
          description: 'Archivo de foto de recepción',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Inspección creada exitosamente' })
  async createInspection(
    @Body('data') data: string,
    @UploadedFiles() files: { signature?: Express.Multer.File[]; photo?: Express.Multer.File[] },
    @Req() req: Request,
  ) {
    if (!data) {
      throw new BadRequestException('El campo data es requerido');
    }

    let dto: CreateInspectionDto;
    try {
      dto = JSON.parse(data) as CreateInspectionDto;
    } catch {
      throw new BadRequestException('El campo data debe ser un JSON válido');
    }

    const signatureFile = files?.signature?.[0];
    const photoFile = files?.photo?.[0];

    if (!photoFile) {
      throw new BadRequestException('El archivo photo es requerido');
    }

    const token = (req.headers['authorization'] as string)?.replace('Bearer ', '') ?? '';
    return this.receptionService.createInspection(dto, signatureFile, photoFile, token);
  }

  @Patch('inspections/:id')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'signature', maxCount: 1 },
    { name: 'photo', maxCount: 1 },
  ]))
  @ApiOperation({ summary: 'Actualizar una inspección por ID con imágenes opcionales' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'string',
          description: 'Datos parciales de la inspección en formato JSON (todos los campos son opcionales)',
          example: '{"mileage":1200,"observations":"actualizado"}',
        },
        signature: {
          type: 'string',
          format: 'binary',
          description: 'Archivo de firma (opcional)',
        },
        photo: {
          type: 'string',
          format: 'binary',
          description: 'Archivo de foto de recepción (opcional)',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Inspección actualizada exitosamente' })
  async updateInspection(
    @Param('id') id: string,
    @Body('data') data: string,
    @UploadedFiles() files: { signature?: Express.Multer.File[]; photo?: Express.Multer.File[] },
    @Req() req: Request,
  ) {
    if (!data) {
      throw new BadRequestException('El campo data es requerido');
    }

    let dto: UpdateInspectionDto;
    try {
      dto = JSON.parse(data) as UpdateInspectionDto;
    } catch {
      throw new BadRequestException('El campo data debe ser un JSON válido');
    }

    const signatureFile = files?.signature?.[0];
    const photoFile = files?.photo?.[0];

    const token = (req.headers['authorization'] as string)?.replace('Bearer ', '') ?? '';
    return this.receptionService.updateInspection(id, dto, signatureFile, photoFile, token);
  }

  @Patch('inspections/:id/checklist-id')
  @ApiOperation({ summary: 'Actualizar solo el checklistId de una inspección' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['checklistId'],
      properties: {
        checklistId: {
          type: 'string',
          description: 'Nuevo ID del checklist',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'checklistId actualizado' })
  async updateInspectionChecklistId(
    @Param('id') id: string,
    @Body('checklistId') checklistId: string,
    @Req() req: Request,
  ) {
    if (!checklistId) {
      throw new BadRequestException('El campo checklistId es requerido');
    }
    const token = (req.headers['authorization'] as string)?.replace('Bearer ', '') ?? '';
    return this.receptionService.updateChecklistId(id, checklistId, token);
  }
}
