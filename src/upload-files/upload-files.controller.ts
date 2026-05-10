import { Controller, Get, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiSecurity, ApiBearerAuth } from '@nestjs/swagger';
import { UploadFilesInfrastructureService } from './infrastructure/upload-files.service';
import type { Request } from 'express';

@ApiTags('upload-files')
@Controller('api/v1')
@ApiSecurity('x-api-key')
@ApiBearerAuth()
export class UploadFilesController {
  constructor(private readonly uploadFilesInfrastructure: UploadFilesInfrastructureService) {}

  @Get('upload-files')
  @ApiOperation({ summary: 'Health check del servicio de upload files' })
  @ApiResponse({ status: 200, description: 'Servicio disponible' })
  healthCheck(@Req() req: Request) {
    const token = (req.headers['authorization'] as string)?.replace('Bearer ', '') ?? '';
    return this.uploadFilesInfrastructure.proxyRequest('GET', '/', null, {
      Authorization: `Bearer ${token}`,
    });
  }
}
