import { Controller, Post, Get, Delete, Body, Param, Req, UsePipes, ValidationPipe, HttpCode, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiResponse, ApiQuery, ApiSecurity, ApiBearerAuth } from '@nestjs/swagger';
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

  @Delete()
  @HttpCode(200)
  @ApiOperation({ summary: 'Invalidar cache por prefijo/patron (ej: auth:users:*, oauth:*, clients:all)' })
  @ApiQuery({ name: 'prefix', required: true, description: 'Prefijo para eliminar multiples keys por patron' })
  @ApiResponse({ status: 200, description: 'Cache invalidado por prefijo' })
  deleteByPrefix(@Query('prefix') prefix: string, @Req() req: Request) {
    const token = (req.headers['authorization'] as string)?.replace('Bearer ', '') ?? '';
    return this.cacheService.deleteByPrefix(prefix, token);
  }
}
