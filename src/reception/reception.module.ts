import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule } from '../clients/clients.module';
import { VehicleModule } from '../vehicle/vehicle.module';
import { ReceptionController } from './reception.controller';
import { ReceptionService } from './application/reception.service';
import { ReceptionInfrastructureService } from './infrastructure/reception.service';

@Module({
  imports: [HttpModule, ConfigModule, ClientsModule, VehicleModule],
  controllers: [ReceptionController],
  providers: [ReceptionService, ReceptionInfrastructureService],
  exports: [ReceptionService, ReceptionInfrastructureService],
})
export class ReceptionModule {}
