import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { writeFileSync } from 'fs';
import { AppDataSource } from 'src/data-source';
import { LoggingService } from './commom/logger/logging.service';

async function bootstrap() {
  const tempLogger = new LoggingService();
  tempLogger.info('Starting application bootstrap...', 'Bootstrap');

  console.log('Starting migrations...');
  try {
    await AppDataSource.initialize();
    console.log('DataSource initialized');

    const migrations = await AppDataSource.runMigrations();
    console.log(`Migrations executed: ${migrations.length}`);

    migrations.forEach((migration) => {
      console.log(`- ${migration.name}`);
    });
  } catch (error) {
    console.error('Migration error:', error);
    process.exit(1);
  }

  console.log('Starting NestJS application...');

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
  tempLogger.info(
    `Application is running on: ${await app.getUrl()}`,
    'Bootstrap',
  );
  tempLogger.info('Swagger documentation available at: /doc', 'Bootstrap');
}
bootstrap();
