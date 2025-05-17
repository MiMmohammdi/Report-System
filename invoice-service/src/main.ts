import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const options = new DocumentBuilder()
    .setTitle('Invoice Service API')
    .setDescription('API list for Invoice Service project')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'access-token',
    )
    .addServer('/api')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document);

  app.setGlobalPrefix('api');
  app.enableCors();

  Logger.log(`Application is Running on port ${process.env.PORT}`);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
