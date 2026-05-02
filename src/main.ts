import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
const basicAuth = require('express-basic-auth');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 3000);
  const swaggerUser = configService.get<string>('SWAGGER_USER');
  const swaggerPass = configService.get<string>('SWAGGER_PASS');

  if (swaggerUser && swaggerPass) {
    app.use(
      '/api/docs',
      basicAuth({
        challenge: true,
        users: { [swaggerUser]: swaggerPass },
      }),
    );
  }

  const config = new DocumentBuilder()
    .setTitle('API Gateway')
    .setDescription('API Gateway para microservicios')
    .setVersion('1.0')
    .addApiKey({ type: 'apiKey', name: 'x-api-key', in: 'header' }, 'x-api-key')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(port);
  console.log(`API Gateway running on port ${port}`);
  console.log(`Swagger docs available at http://localhost:${port}/api/docs`);
}
bootstrap();
