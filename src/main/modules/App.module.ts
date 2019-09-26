import { Module } from '@nestjs/common';
import { AppController } from '../controller/app.controller';
import { AppService } from '../service/App.service';
import { ConfigModule } from './Config.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmFactory } from '../factory/TypeOrm.factory';
import { ConfigService } from '../service/Config.service';
import { AuthModule } from './Auth.module';
import { RoomModule } from './Room.module';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: TypeOrmFactory,
      inject: [ConfigService],
    }),
    AuthModule,
    RoomModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
