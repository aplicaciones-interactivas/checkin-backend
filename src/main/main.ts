import { NestFactory } from '@nestjs/core';
import { MainModule } from './modules/Main.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(MainModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  await app.listen(process.env.PORT);
}

bootstrap();
