import { Module } from '@nestjs/common';
import { AppService } from '../service/App.service';
import { ConfigModule } from './Config.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmFactory } from '../factory/TypeOrm.factory';
import { ConfigService } from '../service/Config.service';
import { AuthModule } from './Auth.module';
import { HotelModule } from './Hotel.module';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: TypeOrmFactory,
      inject: [ConfigService],
    }),
    AuthModule,
    HotelModule,
  ],
  providers: [AppService],
})
export class AppModule {}
