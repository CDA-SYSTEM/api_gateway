import { Controller, Delete, Get, Param, Post, Query, Req, Res, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBody, ApiConsumes, ApiParam, ApiQuery, ApiResponse, ApiSecurity, ApiBearerAuth } from '@nestjs/swagger';
import { UploadFilesService } from './application/upload-files.service';
import { Public } from '../common/decorators/public.decorator';
import { SkipResponseFormat } from '../common/decorators/skip-response-format.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { Roles as RoleConstants } from '../common/constants/roles.constant';
import { buildErrorResponse } from '../common/utils/error-response.util';
import { lastValueFrom } from 'rxjs';
import type { Request, Response } from 'express';

@ApiTags('upload-files')
@Controller('api/v1')
@ApiSecurity('x-api-key')
@ApiBearerAuth()
export class UploadFilesController {
  constructor(private readonly uploadFilesService: UploadFilesService) {}

  @Get('upload-files')
  @ApiOperation({ summary: 'Health check del servicio de upload files' })
  @ApiResponse({ status: 200, description: 'Servicio disponible' })
  healthCheck(@Req() req: Request) {
    const token = (req.headers['authorization'] as string)?.replace('Bearer ', '') ?? '';
    return this.uploadFilesService.healthCheck(token);
  }

  @Get('storage/files')
  @ApiOperation({ summary: 'Listar archivos activos (no eliminados)' })
  @ApiQuery({ name: 'limit', required: true, type: Number, example: 10, description: 'Límite de archivos' })
  @ApiResponse({ status: 200, description: 'Lista de archivos' })
  listFiles(@Query('limit') limit: number, @Req() req: Request) {
    const token = (req.headers['authorization'] as string)?.replace('Bearer ', '') ?? '';
    return this.uploadFilesService.listFiles(limit, token);
  }

  @Delete('storage/files/:id')
  @ApiOperation({ summary: 'Soft delete de archivo (actualiza deleted_at)' })
  @ApiParam({ name: 'id', required: true, type: String, description: 'ID del archivo' })
  @ApiResponse({ status: 200, description: 'Archivo eliminado correctamente' })
  deleteFileById(@Param('id') id: string, @Req() req: Request) {
    const token = (req.headers['authorization'] as string)?.replace('Bearer ', '') ?? '';
    return this.uploadFilesService.deleteFileById(id, token);
  }

  @Public()
  @SkipResponseFormat()
  @Get('storage/files/:id')
  @ApiOperation({ summary: 'Recuperar stream de archivo por ID' })
  @ApiParam({ name: 'id', required: true, type: String, description: 'ID del archivo' })
  @ApiResponse({ status: 200, description: 'Stream del archivo' })
  async getFileById(@Param('id') id: string, @Req() req: Request, @Res() res: Response) {
    const token = (req.headers['authorization'] as string)?.replace('Bearer ', '') ?? '';
    try {
      const { data, contentType, contentDisposition } = await lastValueFrom(
        this.uploadFilesService.getFileById(id, token),
      );
      res.setHeader('Content-Type', contentType);
      if (contentDisposition) {
        res.setHeader('Content-Disposition', contentDisposition);
      }
      res.send(data);
    } catch (error) {
      const errorBody = buildErrorResponse(error, req.url);
      res.status(errorBody.statusCode).json(errorBody);
    }
  }

  @Post('storage/upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload de archivo y persistencia en Cassandra' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary', description: 'Archivo a subir' },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Archivo subido correctamente' })
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Req() req: Request) {
    if (!file) {
      throw new BadRequestException('No se proporcionó ningún archivo');
    }
    const token = (req.headers['authorization'] as string)?.replace('Bearer ', '') ?? '';
    return this.uploadFilesService.uploadFile(file, token);
  }

  @Get('storage/stats')
  @Roles(RoleConstants.ADMIN, RoleConstants.MANAGER, RoleConstants.SUPERADMIN)
  @ApiOperation({ summary: 'Estadísticas de almacenamiento' })
  @ApiResponse({ status: 200, description: 'Estadísticas de almacenamiento' })
  getStorageStats(@Req() req: Request) {
    const token = (req.headers['authorization'] as string)?.replace('Bearer ', '') ?? '';
    return this.uploadFilesService.getStorageStats(token);
  }
}
