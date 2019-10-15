import { Module } from '@nestjs/common';
import { ConfigModule } from './Config.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmFactory } from '../factory/TypeOrm.factory';
import { ConfigService } from '../service/Config.service';
import { UserModule } from './User.module';
import { RoleModule } from './Role.module';
import { HotelModule } from './Hotel.module';
import { AuthModule } from './Auth.module';
import { RoomModule } from './Room.module';
import { RoomTypeModule } from './RoomType.module';
import { InfoEntityModule } from './InfoEntity.module';

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
    RoomModule,
    RoomTypeModule,
    InfoEntityModule,
  ],
})
export class MainModule {
}
