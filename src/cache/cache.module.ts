import { Global, Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { CacheController } from './cache.controller';
import { CacheInfrastructureService } from './infrastructure/cache.service';

@Global()
@Module({
  imports: [HttpModule, ConfigModule],
  controllers: [CacheController],
  providers: [CacheInfrastructureService],
  exports: [CacheInfrastructureService],
})
export class CacheModule {}
