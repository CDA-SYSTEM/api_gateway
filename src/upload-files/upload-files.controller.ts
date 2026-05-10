import { Controller, Get, Post, Req, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBody, ApiConsumes, ApiResponse, ApiSecurity, ApiBearerAuth } from '@nestjs/swagger';
import { UploadFilesService } from './application/upload-files.service';
import type { Request } from 'express';

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
