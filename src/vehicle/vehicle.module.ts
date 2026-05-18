import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { VehicleController } from './vehicle.controller';
import { VehicleService } from './application/vehicle.service';
import { VehicleInfrastructureService } from './infrastructure/vehicle.service';
import { ClientsModule } from '../clients/clients.module';

@Module({
  imports: [HttpModule, ConfigModule, ClientsModule],
  controllers: [VehicleController],
  providers: [VehicleService, VehicleInfrastructureService],
  exports: [VehicleService],
})
export class VehicleModule {}
