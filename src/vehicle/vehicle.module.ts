import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { VehicleController } from './vehicle.controller';
import { VehicleService } from './application/vehicle.service';
import { VehicleInfrastructureService } from './infrastructure/vehicle.service';

@Module({
  imports: [HttpModule, ConfigModule],
  controllers: [VehicleController],
  providers: [VehicleService, VehicleInfrastructureService],
  exports: [VehicleService],
})
export class VehicleModule {}
