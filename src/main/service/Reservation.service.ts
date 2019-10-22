import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { LoggedUserDto } from '../api/request/user/LoggedUser.dto';
import { Reservation } from '../entities/Reservation';
import { CreateReservationDto } from '../api/request/reservation/CreateReservation.dto';
import { ReservationRepository } from '../repository/Reservation.repository';
import { HotelRepository } from '../repository/Hotel.repository';
import { Hotel } from '../entities/Hotel';
import { Room } from '../entities/Room';

@Injectable()
export class ReservationService {

  constructor(private reservationRepository: ReservationRepository, private hotelRepository: HotelRepository) {
  }

  public getMyReservations(user: LoggedUserDto): Promise<Reservation[]> {
    return this.reservationRepository.getByUserId(user.id);
  }

  public async getReservationsByHotelId(hotelId: number, user: LoggedUserDto): Promise<Reservation[]> {
    const hotel: Hotel = await this.hotelRepository.findById(hotelId);
    if (hotel && hotel.userId === user.id) {
      return this.reservationRepository.getByHotelId(hotelId);
    }
    throw new UnauthorizedException();
  }

  public reserve(reservation: CreateReservationDto, user: LoggedUserDto): Promise<Reservation> {
    if (user.roles.includes('USER') && !user.roles.includes('ADMIN')) {
      reservation.userId = user.id;
      return this.reservationRepository.save(reservation);
    }
  }

  public async unreserve(id: number, user: LoggedUserDto) {
    const reservation: Reservation = await this.reservationRepository.findById(id);
    if (user.roles.includes('USER')) {
      this.validateUserToReservation(reservation, user);
    } else if (user.roles.includes('ADMIN')) {
      this.validateAdminToReservation(reservation, user);
    }
    await this.reservationRepository.delete(id);
  }

  private validateUserToReservation(reservation: Reservation, user: LoggedUserDto) {
    if (!reservation) {
      throw new NotFoundException();
    } else if (reservation.user.id !== user.id) {
      throw new UnauthorizedException();
    }

  }

  private async validateAdminToReservation(reservation: Reservation, user: LoggedUserDto) {
    const room: Room = await reservation.room;
    const hotel: Hotel = await room.type.hotel;
    if (hotel.userId !== user.id) {
      throw new UnauthorizedException();
    }
  }
}
