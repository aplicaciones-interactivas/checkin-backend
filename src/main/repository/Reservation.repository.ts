import { LoggedUserDto } from '../dto/user/LoggedUser.dto';
import { Reservation } from '../entities/Reservation';
import { CreateReservationDto } from '../dto/reservation/CreateReservation.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { Hotel } from '../entities/Hotel';
import { RoomRepository } from './Room.repository';
import { Room } from '../entities/Room';
import { RoomService } from '../service/Room.service';

@Injectable()
export class ReservationRepository {

  constructor(@InjectEntityManager() private entityManager: EntityManager, private roomService: RoomService) {
  }

  public getByUserId(userId: number): Promise<Reservation[]> {
    return this.entityManager.find(Reservation, {
      where: {
        user: {
          id: userId,
        },
      },
    });
  }

  public getByHotelId(id: number): Promise<Reservation[]> {
    return this.entityManager.find(Reservation, {
      where: {
        room: {
          roomType: {
            hotelId: id,
          },
        },
      },
    });
  }

  public save(createReservation: CreateReservationDto): Promise<Reservation> {
    return this.entityManager.transaction(async (entityManager) => {
      const rooms: Room[] = await this.roomService.findAvailableByRoomType(createReservation.roomTypeId, createReservation.from, createReservation.until);
      if (rooms.length === 0) {
        throw new NotFoundException();
      }
      let reservation: Reservation = this.entityManager.create(Reservation, createReservation);
      reservation = await this.entityManager.save(Reservation, reservation);
      await entityManager.createQueryBuilder()
        .relation(Reservation, 'hotelMealPlan')
        .of(reservation)
        .set(createReservation.mealPlanId);
      await entityManager.createQueryBuilder()
        .relation(Reservation, 'user')
        .of(reservation)
        .set(createReservation.userId);
      await entityManager.createQueryBuilder()
        .relation(Reservation, 'room')
        .of(reservation)
        .set(rooms[0].id);
      return reservation;
    });
  }

  public async delete(id: number) {
    await this.entityManager.delete(Reservation, id);
  }

  public findById(id: number) {
    return this.entityManager.findOne(Reservation, id);
  }
}
