import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from '../entities/Room';
import { RoomService } from '../service/Room.service';
import { RoomController } from '../controller/Room.controller';
import { HotelService } from '../service/Hotel.service';
import { Hotel } from '../entities/Hotel';
import { HotelController } from '../controller/Hotel.controller';
import { HotelRepository } from '../repository/Hotel.repository';
import { RoomTypeService } from '../service/RoomType.service';
import { RoomTypeRepository } from '../repository/RoomType.repository';
import { HotelImageRepository } from '../repository/HotelImage.repository';
import { HotelImageService } from '../service/HotelImage.service';
import { HotelImageController } from '../controller/HotelImage.controller';
import { HotelImage } from '../entities/HotelImage';

@Module({
  imports: [TypeOrmModule.forFeature([Room, Hotel, HotelImage])],
  exports: [TypeOrmModule, HotelRepository],
  providers: [RoomService, HotelService, HotelRepository, RoomTypeService, RoomTypeRepository, HotelImageRepository, HotelImageService],
  controllers: [RoomController, HotelController, HotelImageController],
})
export class HotelModule {
}
