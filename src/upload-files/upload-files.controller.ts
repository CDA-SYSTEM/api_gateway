import { Controller, Get, Param, Post, Query, Req, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBody, ApiConsumes, ApiParam, ApiQuery, ApiResponse, ApiSecurity, ApiBearerAuth } from '@nestjs/swagger';
import { UploadFilesService } from './application/upload-files.service';
import { SkipResponseFormat } from '../common/decorators/skip-response-format.decorator';
import { tap, map } from 'rxjs';
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

  @SkipResponseFormat()
  @Get('storage/files/:id')
  @ApiOperation({ summary: 'Recuperar stream de archivo por ID' })
  @ApiParam({ name: 'id', required: true, type: String, description: 'ID del archivo' })
  @ApiResponse({ status: 200, description: 'Stream del archivo' })
  getFileById(@Param('id') id: string, @Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const token = (req.headers['authorization'] as string)?.replace('Bearer ', '') ?? '';
    return this.uploadFilesService.getFileById(id, token).pipe(
      tap(({ contentType }) => res.setHeader('Content-Type', contentType)),
      map(({ data }) => data),
    );
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
    const token = (req.headers['authorization'] as string)?.replace('Bearer ', '') ?? '';
    return this.uploadFilesService.uploadFile(file, token);
  }
}
