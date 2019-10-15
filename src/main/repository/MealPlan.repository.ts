import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { MealPlan } from '../entities/MealPlan';

@Injectable()
export class MealPlanRepository {

  constructor(@InjectEntityManager() private entityManager: EntityManager) {
  }

  public findAll(): Promise<MealPlan[]> {
    return this.entityManager.find(MealPlan);
  }
}
