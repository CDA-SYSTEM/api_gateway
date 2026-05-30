import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { InvoiceController } from './invoice.controller';
import { InvoiceService } from './application/invoice.service';
import { InvoiceInfrastructureService } from './infrastructure/invoice.service';
import { InvoicePaidHandler } from './application/invoice-paid.handler';
import { StatusModule } from '../status/status.module';
import { ChecklistModule } from '../checklist/checklist.module';
import { VehicleModule } from '../vehicle/vehicle.module';

@Module({
  imports: [HttpModule, ConfigModule, StatusModule, ChecklistModule, VehicleModule],
  controllers: [InvoiceController],
  providers: [InvoiceService, InvoiceInfrastructureService, InvoicePaidHandler],
  exports: [InvoiceService, InvoiceInfrastructureService],
})
export class InvoiceModule {}
