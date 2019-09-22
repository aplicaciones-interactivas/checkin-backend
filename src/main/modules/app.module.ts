import { Module } from '@nestjs/common';
import { AppController } from '../controller/app.controller';
import { AppService } from '../service/app.service';
import { ConfigModule } from './config.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeormFactory } from '../factory/typeorm.factory';
import { ConfigService } from '../service/config.service';

@Module({
  imports: [ConfigModule, TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    useClass: TypeormFactory,
    inject: [ConfigService],
  })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
