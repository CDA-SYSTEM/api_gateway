import { Global, Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { TokenValidationService } from './services/token-validation.service';
import { UploadFilesModule } from '../upload-files/upload-files.module';
import { ReceptionModule } from '../reception/reception.module';
import { CatalogsModule } from '../catalogs/catalogs.module';
import { CatalogsCrudModule } from '../catalogs-crud/catalogs-crud.module';

@Global()
@Module({
  imports: [HttpModule, ConfigModule, UploadFilesModule, ReceptionModule, CatalogsModule, CatalogsCrudModule],
  providers: [TokenValidationService],
  exports: [HttpModule, ConfigModule, TokenValidationService, UploadFilesModule, ReceptionModule],
})
export class CommonModule {}
