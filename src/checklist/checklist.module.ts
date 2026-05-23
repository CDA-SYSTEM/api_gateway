import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { TemplatesChecklistController } from './templates-checklist.controller';
import { InspectionsChecklistController } from './inspections-checklist.controller';
import { LabradoChecklistController } from './labrado-checklist.controller';
import { TemplatesChecklistService } from './application/templates-checklist.service';
import { InspectionsChecklistService } from './application/inspections-checklist.service';
import { LabradoChecklistService } from './application/labrado-checklist.service';
import { ChecklistInfrastructureService } from './infrastructure/checklist.service';
import { ClientsModule } from '../clients/clients.module';
import { VehicleModule } from '../vehicle/vehicle.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [HttpModule, ConfigModule, ClientsModule, VehicleModule, AuthModule],
  controllers: [
    TemplatesChecklistController,
    InspectionsChecklistController,
    LabradoChecklistController,
  ],
  providers: [
    TemplatesChecklistService,
    InspectionsChecklistService,
    LabradoChecklistService,
    ChecklistInfrastructureService,
  ],
  exports: [TemplatesChecklistService, InspectionsChecklistService, ChecklistInfrastructureService],
})
export class ChecklistModule {}

