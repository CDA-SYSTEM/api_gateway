import {
  Controller, Get, Post, Put, Body, Param, Req, UsePipes, ValidationPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiResponse, ApiSecurity, ApiBearerAuth } from '@nestjs/swagger';
import { LabradoChecklistService } from './application/labrado-checklist.service';
import { CreateLabradoDto } from './application/dtos/create-labrado.dto';
import { UpdateLabradoDto } from './application/dtos/update-labrado.dto';
import type { Request } from 'express';

@ApiTags('checklist-labrado')
@Controller('api/v1/checklist/labrado')
@UsePipes(new ValidationPipe({ transform: true }))
@ApiSecurity('x-api-key')
@ApiBearerAuth()
export class LabradoChecklistController {
  constructor(private readonly labradoService: LabradoChecklistService) {}

  @Post()
  @ApiOperation({ summary: 'Crear o actualizar medidas de labrado' })
  @ApiBody({ type: CreateLabradoDto })
  @ApiResponse({ status: 201, description: 'Medidas de labrado guardadas' })
  create(@Body() body: CreateLabradoDto, @Req() req: Request) {
    const token = (req.headers['authorization'] as string)?.replace('Bearer ', '') ?? '';
    return this.labradoService.create(body, token);
  }

  @Get('by-inspection/:inspectionId')
  @ApiOperation({ summary: 'Obtener medidas de labrado por inspección' })
  @ApiResponse({ status: 200, description: 'Medidas de labrado encontradas' })
  getByInspection(@Param('inspectionId') inspectionId: string, @Req() req: Request) {
    const token = (req.headers['authorization'] as string)?.replace('Bearer ', '') ?? '';
    return this.labradoService.getByInspection(inspectionId, token);
  }

  @Put('by-inspection/:inspectionId')
  @ApiOperation({ summary: 'Actualizar medidas de labrado por inspección' })
  @ApiBody({ type: UpdateLabradoDto })
  @ApiResponse({ status: 200, description: 'Medidas de labrado actualizadas' })
  updateByInspection(
    @Param('inspectionId') inspectionId: string,
    @Body() body: UpdateLabradoDto,
    @Req() req: Request,
  ) {
    const token = (req.headers['authorization'] as string)?.replace('Bearer ', '') ?? '';
    return this.labradoService.updateByInspection(inspectionId, body, token);
  }
}
