import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { InvoiceController } from './invoice.controller';
import { InvoiceService } from './application/invoice.service';
import { InvoiceInfrastructureService } from './infrastructure/invoice.service';

@Module({
  imports: [HttpModule, ConfigModule],
  controllers: [InvoiceController],
  providers: [InvoiceService, InvoiceInfrastructureService],
  exports: [InvoiceService, InvoiceInfrastructureService],
})
export class InvoiceModule {}
