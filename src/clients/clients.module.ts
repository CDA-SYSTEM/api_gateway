import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { ClientsController } from './clients.controller';
import { ClientsApplicationService } from './application/clients.service';
import { ClientsInfrastructureService } from './infrastructure/clients.service';

@Module({
  imports: [HttpModule, ConfigModule],
  controllers: [ClientsController],
  providers: [ClientsApplicationService, ClientsInfrastructureService],
  exports: [ClientsApplicationService],
})
export class ClientsModule {}
