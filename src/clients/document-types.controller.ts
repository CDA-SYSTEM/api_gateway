import { Controller, Get, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiSecurity, ApiBearerAuth } from '@nestjs/swagger';
import { DocumentTypesService } from './application/document-types.service';
import type { Request } from 'express';

@ApiTags('document-types')
@Controller('api/v1')
@ApiSecurity('x-api-key')
@ApiBearerAuth()
export class DocumentTypesController {
  constructor(private readonly documentTypesService: DocumentTypesService) {}

  @Get('document-types')
  @ApiOperation({ summary: 'Listar tipos de documento' })
  @ApiResponse({ status: 200, description: 'Lista de tipos de documento' })
  async listAll(@Req() req: Request) {
    const token = (req.headers['authorization'] as string)?.replace('Bearer ', '') ?? '';
    return this.documentTypesService.listAll(token);
  }
}
