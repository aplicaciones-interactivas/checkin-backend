import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { HotelRequest } from '../api/request/hotel/Hotel.request';
import { Hotel } from '../entities/Hotel';
import { Amenity } from '../entities/Amenity';
import { MealPlan } from '../entities/MealPlan';
import { User } from '../entities/User';
import { HotelRepository } from '../repository/Hotel.repository';

@Injectable()
export class HotelService {
  hotelRepository: HotelRepository;

  constructor(hotelRepository: HotelRepository) {
    this.hotelRepository = hotelRepository;
  }

  public async create(hotelRequest: HotelRequest) {
    return await this.hotelRepository.create(hotelRequest);
  }

  public async update(entityId: number, hotelRequest) {
    return await this.hotelRepository.update(entityId, hotelRequest);
  }

  public async delete(entityId: number) {
    await this.hotelRepository.delete(entityId);
  }

  public async findAllByUser(user: User) {
    if (user.roles.map(r => r.roleName).includes('SUPERUSER')) {
      return await this.hotelRepository.findAll();
    }
    return await this.hotelRepository.findAllByUser(user.id);
  }
}
