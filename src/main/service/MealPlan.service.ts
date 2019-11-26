import { Injectable } from '@nestjs/common';
import { MealPlan } from '../entities/MealPlan';
import { MealPlanRepository } from '../repository/MealPlan.repository';
import { HotelMealPlan } from '../entities/HotelMealPlan';
import { HotelMealPlanRepository } from '../repository/HotelMealPlan.repository';
import { Hotel } from '../entities/Hotel';

@Injectable()
export class MealPlanService {
  constructor(private mealPlanRepository: MealPlanRepository, private hotelMealPlanRepository: HotelMealPlanRepository) {
  }

  public findAll(): Promise<MealPlan[]> {
    return this.mealPlanRepository.findAll();
  }

  public findAllByUserId(userId: number): Promise<HotelMealPlan[]> {
    return this.hotelMealPlanRepository.findByUserId(userId);
  }

  findById(id: number): Promise<HotelMealPlan> {
    return this.hotelMealPlanRepository.findById(id);
  }
}
