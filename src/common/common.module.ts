import { Global, Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { TokenValidationService } from './services/token-validation.service';
import { UploadFilesModule } from '../upload-files/upload-files.module';
import { ReceptionModule } from '../reception/reception.module';

@Global()
@Module({
  imports: [HttpModule, ConfigModule, UploadFilesModule, ReceptionModule],
  providers: [TokenValidationService],
  exports: [HttpModule, ConfigModule, TokenValidationService, UploadFilesModule, ReceptionModule],
})
export class CommonModule {}
