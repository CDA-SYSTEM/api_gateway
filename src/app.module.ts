import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpModule, HttpService } from '@nestjs/axios';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { VehicleModule } from './vehicle/vehicle.module';
import { ClientsModule } from './clients/clients.module';
import { CommonModule } from './common/common.module';
import { CombinedGuard } from './common/guards/combined.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    HttpModule,
    CommonModule,
    AuthModule,
    VehicleModule,
    ClientsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: CombinedGuard,
    },
  ],
})
export class AppModule implements OnModuleInit {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  onModuleInit() {
    const apiKey = this.configService.get<string>('API_KEY');
    if (!apiKey) {
      throw new Error('API_KEY is not defined in .env file');
    }
    this.httpService.axiosRef.interceptors.request.use((config) => {
      config.headers['x-api-key'] = apiKey;
      return config;
    });
  }
}
