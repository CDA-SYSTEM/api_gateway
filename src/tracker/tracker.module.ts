import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { TrackerController } from './tracker.controller';
import { TrackerApplicationService } from './application/tracker.service';
import { TrackerInfrastructureService } from './infrastructure/tracker.service';

@Module({
  imports: [HttpModule, ConfigModule],
  controllers: [TrackerController],
  providers: [TrackerApplicationService, TrackerInfrastructureService],
  exports: [TrackerApplicationService, TrackerInfrastructureService],
})
export class TrackerModule {}
