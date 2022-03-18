import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import sequelize from './database';
import { config as initialize_env } from 'dotenv';

initialize_env();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  console.log(`Database Version: ${await sequelize.databaseVersion()}`);
  await app.listen(4000);
}
bootstrap();
