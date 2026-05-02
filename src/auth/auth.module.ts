import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthApplicationService } from './application/auth.service';
import { AuthInfrastructureService } from './infrastructure/auth.service';
import { ApiKeyGuard } from '../common/guards/api-key.guard';

@Module({
  imports: [HttpModule, ConfigModule],
  controllers: [AuthController],
  providers: [AuthApplicationService, AuthInfrastructureService, ApiKeyGuard],
  exports: [AuthApplicationService],
})
export class AuthModule {}
