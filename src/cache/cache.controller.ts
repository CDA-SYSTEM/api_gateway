import { Controller, Post, Get, Delete, Body, Param, Req, UsePipes, ValidationPipe, HttpCode } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiResponse, ApiSecurity, ApiBearerAuth } from '@nestjs/swagger';
import { CacheInfrastructureService } from './infrastructure/cache.service';
import { SaveCacheDto } from './application/dtos/save-cache.dto';
import type { Request } from 'express';

@ApiTags('cache')
@Controller('cache')
@UsePipes(new ValidationPipe({ transform: true }))
@ApiSecurity('x-api-key')
@ApiBearerAuth()
export class CacheController {
  constructor(private readonly cacheService: CacheInfrastructureService) {}

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Guardar lista en cache con TTL' })
  @ApiBody({ type: SaveCacheDto })
  @ApiResponse({ status: 201, description: 'Cache guardado exitosamente' })
  save(@Body() body: SaveCacheDto, @Req() req: Request) {
    const token = (req.headers['authorization'] as string)?.replace('Bearer ', '') ?? '';
    return this.cacheService.save(body, token);
  }

  @Get(':key')
  @ApiOperation({ summary: 'Obtener lista desde cache por key' })
  @ApiResponse({ status: 200, description: 'Cache encontrado' })
  getByKey(@Param('key') key: string, @Req() req: Request) {
    const token = (req.headers['authorization'] as string)?.replace('Bearer ', '') ?? '';
    return this.cacheService.getByKey(key, token);
  }

  @Delete(':key')
  @ApiOperation({ summary: 'Invalidar cache por key' })
  @ApiResponse({ status: 200, description: 'Cache invalidado' })
  deleteByKey(@Param('key') key: string, @Req() req: Request) {
    const token = (req.headers['authorization'] as string)?.replace('Bearer ', '') ?? '';
    return this.cacheService.deleteByKey(key, token);
  }
}
