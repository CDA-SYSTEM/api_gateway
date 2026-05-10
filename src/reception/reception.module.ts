import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { ReceptionController } from './reception.controller';
import { ReceptionService } from './application/reception.service';
import { ReceptionInfrastructureService } from './infrastructure/reception.service';

@Module({
  imports: [HttpModule, ConfigModule],
  controllers: [ReceptionController],
  providers: [ReceptionService, ReceptionInfrastructureService],
  exports: [ReceptionService, ReceptionInfrastructureService],
})
export class ReceptionModule {}
