import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/App.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(app.get('ConfigService').getEnvConfig.API_PORT);
}

bootstrap();
