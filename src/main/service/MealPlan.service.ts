import { Injectable } from '@nestjs/common';
import { MealPlan } from '../entities/MealPlan';
import { MealPlanRepository } from '../repository/MealPlan.repository';

@Injectable()
export class MealPlanService {
  constructor(private mealPlanRepository: MealPlanRepository) {
  }

  public findAll(): Promise<MealPlan[]> {
    return this.mealPlanRepository.findAll();
  }
}
