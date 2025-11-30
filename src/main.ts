import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { writeFileSync } from 'fs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('Home Library Service')
    .setDescription('The home libray API description')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  writeFileSync('./doc/openapi-spec.json', JSON.stringify(document, null, 2));

  SwaggerModule.setup('doc', app, document);

  await app.listen(4000);
}
bootstrap();
