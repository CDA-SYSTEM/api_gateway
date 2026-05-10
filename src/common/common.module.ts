import { Global, Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { TokenValidationService } from './services/token-validation.service';
import { UploadFilesModule } from '../upload-files/upload-files.module';

@Global()
@Module({
  imports: [HttpModule, ConfigModule, UploadFilesModule],
  providers: [TokenValidationService],
  exports: [HttpModule, ConfigModule, TokenValidationService, UploadFilesModule],
})
export class CommonModule {}
