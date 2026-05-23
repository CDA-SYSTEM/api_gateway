import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule } from '../clients/clients.module';
import { VehicleModule } from '../vehicle/vehicle.module';
import { AuthModule } from '../auth/auth.module';
import { UploadFilesModule } from '../upload-files/upload-files.module';
import { ChecklistModule } from '../checklist/checklist.module';
import { ReceptionController } from './reception.controller';
import { ReceptionService } from './application/reception.service';
import { ReceptionInfrastructureService } from './infrastructure/reception.service';

@Module({
  imports: [HttpModule, ConfigModule, ClientsModule, VehicleModule, AuthModule, UploadFilesModule, ChecklistModule],
  controllers: [ReceptionController],
  providers: [ReceptionService, ReceptionInfrastructureService],
  exports: [ReceptionService, ReceptionInfrastructureService],
})
export class ReceptionModule {}
