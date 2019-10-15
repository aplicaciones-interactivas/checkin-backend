import { Controller, Get, Injectable } from '@nestjs/common';
import { MealPlan } from '../entities/MealPlan';
import { MealPlanRepository } from '../repository/MealPlan.repository';
import { MealPlanService } from '../service/MealPlan.service';

@Controller('meal-plan')
export class MealPlanController {
  constructor(private mealPlanService: MealPlanService) {
  }

  @Get()
  public findAll(): Promise<MealPlan[]> {
    return this.mealPlanService.findAll();
  }
}
