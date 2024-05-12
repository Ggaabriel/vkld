import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as path from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as dotenv from 'dotenv';
async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.setGlobalPrefix('api');

  app.useStaticAssets(path.join(__dirname, '..', 'images'), {
    prefix: '/images', // Префикс URL для доступа к статическим файлам
  });
  await app.listen(3000);
}
bootstrap();
