import { NestFactory } from '@nestjs/core';
import { MainModule } from './modules/Main.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(MainModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  await app.listen(app.get('ConfigService').getEnvConfig.API_PORT);
}

bootstrap();
