import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { UploadFilesController } from './upload-files.controller';
import { UploadFilesInfrastructureService } from './infrastructure/upload-files.service';

@Module({
  imports: [HttpModule, ConfigModule],
  controllers: [UploadFilesController],
  providers: [UploadFilesInfrastructureService],
  exports: [UploadFilesInfrastructureService],
})
export class UploadFilesModule {}
