import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from '../entities/Room';
import { RoomService } from '../service/Room.service';
import { RoomController } from '../controller/Room.controller';
import { HotelService } from '../service/Hotel.service';
import { Hotel } from '../entities/Hotel';
import { HotelController } from '../controller/Hotel.controller';
import { HotelRepository } from '../repository/Hotel.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Room, Hotel])],
  exports: [TypeOrmModule],
  providers: [RoomService, HotelService, RoomController, HotelController, HotelRepository],
  controllers: [RoomController, HotelController],
})
export class HotelModule {
}
