import { Module } from '@nestjs/common';
import { AppService } from '../service/App.service';
import { ConfigModule } from './Config.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmFactory } from '../factory/TypeOrm.factory';
import { ConfigService } from '../service/Config.service';
import { UserModule } from './User.module';
import { RoleModule } from './Role.module';
import { HotelModule } from './Hotel.module';
import { AuthModule } from './Auth.module';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: TypeOrmFactory,
      inject: [ConfigService],
    }),
    UserModule,
    RoleModule,
    HotelModule,
    AuthModule,
  ],
  providers: [AppService],
})
export class AppModule {}
