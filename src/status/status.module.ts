import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { StatusController } from './status.controller';
import { StatusService } from './application/status.service';
import { StatusInfrastructureService } from './infrastructure/status.service';

@Module({
  imports: [HttpModule, ConfigModule],
  controllers: [StatusController],
  providers: [StatusService, StatusInfrastructureService],
  exports: [StatusService, StatusInfrastructureService],
})
export class StatusModule {}
