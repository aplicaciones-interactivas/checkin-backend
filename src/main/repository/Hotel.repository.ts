import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { HotelRequest } from '../api/request/hotel/Hotel.request';
import { Hotel } from '../entities/Hotel';
import { Amenity } from '../entities/Amenity';
import { MealPlan } from '../entities/MealPlan';
import { User } from '../entities/User';
import { InjectEntityManager } from '@nestjs/typeorm';

@Injectable()
export class HotelRepository {
  private entityManager: EntityManager;

  constructor(@InjectEntityManager() entityManager: EntityManager) {
    this.entityManager = entityManager;
  }

  public async create(hotelRequest: HotelRequest) {
    let hotel = this.entityManager.create(Hotel, hotelRequest);
    return this.entityManager.transaction(async entityManager => {
      hotel = await entityManager.save(hotel);
      const amenities: Amenity[] = await entityManager.findByIds(Amenity, hotelRequest.amenitiesId);
      const mealPlans: MealPlan[] = await entityManager.findByIds(MealPlan, hotelRequest.mealPlansId);
      entityManager.createQueryBuilder()
        .relation(Hotel, 'amenities')
        .of(hotel)
        .add(amenities);
      entityManager.createQueryBuilder()
        .relation(Hotel, 'mealPlans')
        .of(hotel)
        .add(mealPlans);
      return hotel;
    });
  }

  public async update(entityId: number, hotelRequest) {
    return await this.entityManager.transaction(async entityManager => {
      const hotel = entityManager.create(Hotel, hotelRequest);
      await entityManager.update(Hotel, { where: { id: entityId } }, hotel);
      return await entityManager.findOne(Hotel, entityId);
    });
  }

  public async delete(entityId: number) {
    await this.entityManager.delete(Hotel, { where: { id: entityId } });
  }

  public async findAllByUser(id: number) {
    return await this.entityManager.find(Hotel, { where: { userId: id } });
  }

  public async findAll() {
    return await this.entityManager.find(Hotel);
  }

  public async findById(id: number) {
    return await this.entityManager.findOne(Hotel, id);
  }
}
