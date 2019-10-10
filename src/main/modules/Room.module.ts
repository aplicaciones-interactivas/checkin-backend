import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from '../entities/Room';
import { RoomService } from '../service/Room.service';
import { RoomTypeModule } from './RoomType.module';
import { RoomRepository } from '../repository/Room.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Room]), RoomTypeModule],
  exports: [TypeOrmModule, RoomService, RoomRepository, RoomTypeModule],
  providers: [RoomService, RoomRepository, RoomTypeModule],
})
export class RoomModule {

}
