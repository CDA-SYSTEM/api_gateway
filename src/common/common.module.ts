import { Global, Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { TokenValidationService } from './services/token-validation.service';

@Global()
@Module({
  imports: [HttpModule, ConfigModule],
  providers: [TokenValidationService],
  exports: [HttpModule, ConfigModule, TokenValidationService],
})
export class CommonModule {}
