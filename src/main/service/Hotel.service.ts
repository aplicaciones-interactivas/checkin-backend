import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { HotelRequest } from '../api/request/hotel/Hotel.request';
import { Hotel } from '../entities/Hotel';
import { Amenity } from '../entities/Amenity';
import { MealPlan } from '../entities/MealPlan';

@Injectable()
export class HotelService {
  private entityManager: EntityManager;

  constructor(entityManager: EntityManager) {
    this.entityManager = entityManager;
  }

  public async create(hotelRequest: HotelRequest) {
    let hotel = this.entityManager.create(Hotel, hotelRequest);
    await this.entityManager.transaction(async entityManager => {
      hotel = await entityManager.save(hotel);
      const amenities: Amenity[] = await entityManager.findByIds(Amenity, hotelRequest.amenitiesId);
      const mealPlans: MealPlan[] = await entityManager.findByIds(MealPlan, hotelRequest.mealPlansId);
      entityManager.createQueryBuilder()
        .relation(Hotel, 'amenities')
        .of(hotel)
        .set(amenities);
      entityManager.createQueryBuilder()
        .relation(Hotel, 'mealPlans')
        .of(hotel)
        .set(mealPlans);
    });
  }

  public async update(entityId: number, hotelRequest) {
    return await this.entityManager.transaction(async entityManager => {
      const hotel = entityManager.create(hotelRequest);
      await entityManager.update(Hotel, { where: { id: entityId } }, hotel);
      return await entityManager.findOne(Hotel, entityId);
    });
  }

  public async delete(entityId: number) {
    await this.entityManager.delete(Hotel, { where: { id: entityId } });
  }
}
