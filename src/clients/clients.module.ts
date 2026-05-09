import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { ClientsController } from './clients.controller';
import { DocumentTypesController } from './document-types.controller';
import { PersonTypesController } from './person-types.controller';
import { RootController } from './root.controller';
import { ClientsApplicationService } from './application/clients.service';
import { DocumentTypesService } from './application/document-types.service';
import { PersonTypesService } from './application/person-types.service';
import { ClientsInfrastructureService } from './infrastructure/clients.service';

@Module({
  imports: [HttpModule, ConfigModule],
  controllers: [ClientsController, DocumentTypesController, PersonTypesController, RootController],
  providers: [ClientsApplicationService, DocumentTypesService, PersonTypesService, ClientsInfrastructureService],
  exports: [ClientsApplicationService],
})
export class ClientsModule {}
