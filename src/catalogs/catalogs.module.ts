import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { CatalogsController } from './catalogs.controller';
import { CatalogsService } from './application/catalogs.service';
import { CatalogsInfrastructureService } from './infrastructure/catalogs.service';

@Module({
  imports: [HttpModule, ConfigModule],
  controllers: [CatalogsController],
  providers: [CatalogsService, CatalogsInfrastructureService],
})
export class CatalogsModule {}
