import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Amenity } from '../entities/Amenity';
import { MealPlan } from '../entities/MealPlan';
import { AmenitiyRepository } from '../repository/Amenitiy.repository';
import { AmenityService } from '../service/Amenity.service';
import { MealPlanRepository } from '../repository/MealPlan.repository';
import { MealPlanService } from '../service/MealPlan.service';
import { AmenityController } from '../controller/Amenity.controller';
import { MealPlanController } from '../controller/MealPlan.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Amenity, MealPlan])],
  exports: [TypeOrmModule],
  providers: [AmenitiyRepository, AmenityService, MealPlanRepository, MealPlanService],
  controllers: [AmenityController, MealPlanController],
})
export class InfoEntityModule {
}
