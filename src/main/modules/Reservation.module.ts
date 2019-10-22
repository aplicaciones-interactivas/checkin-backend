import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { Reservation } from '../entities/Reservation';
import { ReservationRepository } from '../repository/Reservation.repository';
import { ReservationService } from '../service/Reservation.service';
import { ReservationController } from '../controller/Reservation.controller';
import { HotelModule } from './Hotel.module';
import { RoomModule } from './Room.module';

@Module({
  imports: [TypeOrmModule.forFeature([Reservation]), HotelModule, RoomModule],
  exports: [TypeOrmModule, ReservationRepository, ReservationService],
  providers: [ReservationRepository, ReservationService],
  controllers: [ReservationController],
})
export class ReservationModule {
}
