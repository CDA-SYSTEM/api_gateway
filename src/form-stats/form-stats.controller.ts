import { Controller, Get, Req } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiResponse, ApiSecurity, ApiBearerAuth } from '@nestjs/swagger';
import type { Request } from 'express';
import { FormStatsService } from './form-stats.service';
import { Roles } from '../common/decorators/roles.decorator';
import { Roles as RoleConstants } from '../common/constants/roles.constant';

@ApiTags('Admin Stats')
@Controller('api/v1/stats')
@ApiSecurity('x-api-key')
@ApiBearerAuth()
export class FormStatsController {
  constructor(private readonly formStatsService: FormStatsService) {}

  @Get('inspections')
  @Roles(RoleConstants.ADMIN, RoleConstants.MANAGER, RoleConstants.SUPERADMIN)
  @ApiOperation({ summary: 'Estadísticas de inspecciones' })
  @ApiResponse({ status: 200, description: 'Estadísticas de inspecciones' })
  getInspectionStats(@Req() req: Request) {
    const token = (req.headers['authorization'] as string)?.replace('Bearer ', '') ?? '';
    return this.formStatsService.getInspectionStats(token);
  }

  @Get('invoices')
  @Roles(RoleConstants.ADMIN, RoleConstants.MANAGER, RoleConstants.SUPERADMIN)
  @ApiOperation({ summary: 'Estadísticas de facturas' })
  @ApiResponse({ status: 200, description: 'Estadísticas de facturas' })
  getInvoiceStats(@Req() req: Request) {
    const token = (req.headers['authorization'] as string)?.replace('Bearer ', '') ?? '';
    return this.formStatsService.getInvoiceStats(token);
  }

  @Get('full')
  @Roles(RoleConstants.ADMIN, RoleConstants.MANAGER, RoleConstants.SUPERADMIN)
  @ApiOperation({ summary: 'Estadísticas completas (inspecciones + facturas)' })
  @ApiResponse({ status: 200, description: 'Estadísticas completas' })
  getFullStats(@Req() req: Request) {
    const token = (req.headers['authorization'] as string)?.replace('Bearer ', '') ?? '';
    return this.formStatsService.getFullStats(token);
  }
}
