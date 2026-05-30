import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { PriceController } from './price.controller';
import { PriceService } from './application/price.service';
import { PriceInfrastructureService } from './infrastructure/price.service';

@Module({
  imports: [HttpModule, ConfigModule],
  controllers: [PriceController],
  providers: [PriceService, PriceInfrastructureService],
  exports: [PriceService, PriceInfrastructureService],
})
export class PriceModule {}
