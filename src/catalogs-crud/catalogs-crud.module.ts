import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { CatalogsCrudController } from './catalogs-crud.controller';
import { CatalogsCrudService } from './application/catalogs-crud.service';
import { CatalogsCrudInfrastructureService } from './infrastructure/catalogs-crud.service';

@Module({
  imports: [HttpModule, ConfigModule],
  controllers: [CatalogsCrudController],
  providers: [CatalogsCrudService, CatalogsCrudInfrastructureService],
})
export class CatalogsCrudModule {}
