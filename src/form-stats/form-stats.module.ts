import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { FormStatsController } from './form-stats.controller';
import { FormStatsService } from './form-stats.service';
import { FormStatsInfrastructureService } from './form-stats-infrastructure.service';

@Module({
  imports: [HttpModule, ConfigModule],
  controllers: [FormStatsController],
  providers: [FormStatsService, FormStatsInfrastructureService],
})
export class FormStatsModule {}
