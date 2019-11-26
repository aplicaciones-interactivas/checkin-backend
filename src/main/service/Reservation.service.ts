import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { LoggedUserDto } from '../dto/user/LoggedUser.dto';
import { Reservation } from '../entities/Reservation';
import { CreateReservationDto } from '../dto/reservation/CreateReservation.dto';
import { ReservationRepository } from '../repository/Reservation.repository';
import { HotelRepository } from '../repository/Hotel.repository';
import { Hotel } from '../entities/Hotel';
import { Room } from '../entities/Room';
import { RoomTypeService } from './RoomType.service';
import { PriceDto } from '../dto/price/PriceDto';
import moment = require('moment');
import { HotelMealPlan } from '../entities/HotelMealPlan';

@Injectable()
export class ReservationService {

  constructor(private reservationRepository: ReservationRepository, private hotelRepository: HotelRepository, private roomTypeService: RoomTypeService) {
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

  public async reserve(reservation: CreateReservationDto, user: LoggedUserDto): Promise<Reservation> {
    if (user.roles.includes('USER') && !user.roles.includes('ADMIN')) {
      reservation.userId = user.id;
      reservation.totalPrice = (await this.getTotalPriceOfReservation(reservation));
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
    const hotel: Hotel = room.roomType.hotel;
    if (hotel.userId !== user.id) {
      throw new UnauthorizedException();
    }
  }

  public async getTotalPrice(roomTypeId: number, from: string, until: string) {
    const price: number = (await this.roomTypeService.findById(roomTypeId)).price;
    const priceDto: PriceDto = new PriceDto();
    const days = moment(until).diff(moment(from), 'days');
    priceDto.price = price * days;
    return priceDto;
  }

  public async getTotalPriceOfReservation(reservation: CreateReservationDto) {
    const from: string = moment(reservation.from).format();
    const until: string = moment(reservation.until).format();

    const priceOfRoom: number = (await this.getTotalPrice(reservation.roomTypeId, from, until)).price;
    if (reservation.mealPlanId) {
      const mealPlan: HotelMealPlan = (await this.hotelRepository.getHotelMealPlanById(reservation.mealPlanId));
      const days = moment(until).diff(moment(from), 'days');
      return priceOfRoom + (days * mealPlan.additionalPrice);
    }
    return priceOfRoom;
  }
}
