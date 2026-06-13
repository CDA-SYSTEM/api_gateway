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
        folder_id: { type: 'string', format: 'uuid', description: 'ID de carpeta (opcional)' },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Archivo subido correctamente' })
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Req() req: Request) {
    if (!file) {
      throw new BadRequestException('No se proporcionó ningún archivo');
    }
    const token = (req.headers['authorization'] as string)?.replace('Bearer ', '') ?? '';
    const folderId = req.body?.['folder_id'] as string | undefined;
    return this.uploadFilesService.uploadFile(file, token, folderId);
  }

  @Post('storage/folders')
  @ApiOperation({ summary: 'Crear una carpeta' })
  @ApiResponse({ status: 201, description: 'Carpeta creada exitosamente' })
  createFolder(@Req() req: Request) {
    const token = (req.headers['authorization'] as string)?.replace('Bearer ', '') ?? '';
    const { name, parent_id } = req.body ?? {};
    if (!name) {
      throw new BadRequestException('El nombre de la carpeta es requerido');
    }
    return this.uploadFilesService.createFolder(name, token, parent_id);
  }

  @Delete('storage/folders/:id')
  @ApiOperation({ summary: 'Eliminar carpeta (solo si está vacía)' })
  @ApiParam({ name: 'id', required: true, type: String, description: 'ID de la carpeta' })
  @ApiResponse({ status: 200, description: 'Carpeta eliminada' })
  @ApiResponse({ status: 400, description: 'La carpeta contiene archivos activos' })
  deleteFolder(@Param('id') id: string, @Req() req: Request) {
    const token = (req.headers['authorization'] as string)?.replace('Bearer ', '') ?? '';
    return this.uploadFilesService.deleteFolder(id, token);
  }

  @Get('storage/folders')
  @ApiOperation({ summary: 'Listar todas las carpetas' })
  @ApiQuery({ name: 'search', required: false, type: String, description: 'Filtrar por nombre de carpeta' })
  @ApiResponse({ status: 200, description: 'Listado de carpetas' })
  listFolders(@Query('search') search: string, @Req() req: Request) {
    const token = (req.headers['authorization'] as string)?.replace('Bearer ', '') ?? '';
    return this.uploadFilesService.listFolders(token, search);
  }

  @Get('storage/folders/root/contents')
  @ApiOperation({ summary: 'Listar carpetas raíz y archivos sin carpeta' })
  @ApiResponse({ status: 200, description: 'Contenido de la raíz' })
  listRootContents(@Req() req: Request) {
    const token = (req.headers['authorization'] as string)?.replace('Bearer ', '') ?? '';
    return this.uploadFilesService.getFolderContents(null, token);
  }

  @Get('storage/folders/:id/contents')
  @ApiOperation({ summary: 'Listar subcarpetas y archivos de una carpeta' })
  @ApiResponse({ status: 200, description: 'Contenido de la carpeta' })
  listFolderContents(@Param('id') id: string, @Req() req: Request) {
    const token = (req.headers['authorization'] as string)?.replace('Bearer ', '') ?? '';
    return this.uploadFilesService.getFolderContents(id, token);
  }

  @Get('storage/folders/:id/files')
  @ApiOperation({ summary: 'Listar archivos por carpeta' })
  @ApiResponse({ status: 200, description: 'Archivos de la carpeta' })
  listFilesByFolder(@Param('id') id: string, @Req() req: Request) {
    const token = (req.headers['authorization'] as string)?.replace('Bearer ', '') ?? '';
    return this.uploadFilesService.listFilesByFolder(id, token);
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
