import { Controller, Get, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiSecurity, ApiBearerAuth } from '@nestjs/swagger';
import { PersonTypesService } from './application/person-types.service';
import type { Request } from 'express';

@ApiTags('person-types')
@Controller('api/v1')
@ApiSecurity('x-api-key')
@ApiBearerAuth()
export class PersonTypesController {
  constructor(private readonly personTypesService: PersonTypesService) {}

  @Get('person-types')
  @ApiOperation({ summary: 'Listar tipos de persona' })
  @ApiResponse({ status: 200, description: 'Lista de tipos de persona' })
  async listAll(@Req() req: Request) {
    const token = (req.headers['authorization'] as string)?.replace('Bearer ', '') ?? '';
    return this.personTypesService.listAll(token);
  }
}
