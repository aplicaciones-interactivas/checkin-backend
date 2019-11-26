import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { HotelMealPlan } from '../entities/HotelMealPlan';

export class HotelMealPlanRepository {

  constructor(@InjectEntityManager() private entityManager: EntityManager) {
  }

  findByUserId(userId: number) {
    return this.entityManager.createQueryBuilder()
      .from(HotelMealPlan, 'hotelMealPlan')
      .select('hotelMealPlan')
      .innerJoinAndSelect('hotelMealPlan.hotel', 'hotel')
      .innerJoinAndSelect('hotelMealPlan.mealPlan', 'mealPlan')
      .where('hotel.userId = :id', { id: userId })
      .getMany();
  }

  async findById(entityId: number) {
    return this.entityManager.findOne(HotelMealPlan, entityId, {
      relations: ['mealPlan', 'hotel'],
    });
  }
}
