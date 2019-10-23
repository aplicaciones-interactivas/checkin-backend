import { Injectable, UnauthorizedException } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { HotelDto } from '../api/request/hotel/Hotel.dto';
import { Hotel } from '../entities/Hotel';
import { Amenity } from '../entities/Amenity';
import { MealPlan } from '../entities/MealPlan';
import { User } from '../entities/User';
import { HotelRepository } from '../repository/Hotel.repository';
import { LoggedUserDto } from '../api/request/user/LoggedUser.dto';
import { PermissionUtils } from '../utils/Permission.utils';
import { HotelFilterDto } from '../api/request/hotel/HotelFilter.dto';

@Injectable()
export class HotelService {
  hotelRepository: HotelRepository;

  constructor(hotelRepository: HotelRepository) {
    this.hotelRepository = hotelRepository;
  }

  private validateAndContinue(hotelOwner: number, user: LoggedUserDto) {
    if (hotelOwner) {
      if (hotelOwner !== user.id && !PermissionUtils.hasRole(user, 'SUPERUSER')) {
        throw new UnauthorizedException();
      }
    }
  }

  public async create(hotelRequest: HotelDto, user: LoggedUserDto) {
    if (!PermissionUtils.hasRole(user, 'SUPERUSER')) {
      hotelRequest.userId = user.id;
    }
    return this.hotelRepository.create(hotelRequest);
  }

  public async update(entityId: number, hotelRequest: HotelDto, user: LoggedUserDto) {
    const hotel = await this.hotelRepository.findById(entityId);
    this.validateAndContinue(hotel.userId, user);
    return this.hotelRepository.update(entityId, hotelRequest);
  }

  public async delete(entityId: number, user: LoggedUserDto) {
    const hotel = await this.hotelRepository.findById(entityId);
    this.validateAndContinue(hotel.userId, user);
    await this.hotelRepository.delete(entityId);
  }

  public async findAll(pageNumber: number) {
    const filter: HotelFilterDto = new HotelFilterDto();
    filter.page = pageNumber;
    return this.hotelRepository.findAll(filter);
  }

  public async findAllByUser(user: LoggedUserDto, filter: HotelFilterDto) {
    if (PermissionUtils.hasRole(user, 'SUPERUSER')) {
      return this.hotelRepository.findAll(filter);
    }
    return this.hotelRepository.findAllByUser(user.id, filter);
  }

  public async findByFilters(filters: HotelFilterDto) {
    return this.hotelRepository.findAllByFilter(filters);
  }

}
