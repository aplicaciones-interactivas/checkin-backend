import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Amenity } from '../entities/Amenity';
import { MealPlan } from '../entities/MealPlan';
import { Bed } from '../entities/Bed';
import { AmenitiyRepository } from '../repository/Amenitiy.repository';
import { AmenityService } from '../service/Amenity.service';
import { MealPlanRepository } from '../repository/MealPlan.repository';
import { MealPlanService } from '../service/MealPlan.service';
import { BedRepository } from '../repository/Bed.repository';
import { BedService } from '../service/Bed.service';
import { AmenityController } from '../controller/Amenity.controller';
import { BedController } from '../controller/Bed.controller';
import { MealPlanController } from '../controller/MealPlan.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Amenity, MealPlan, Bed])],
  exports: [TypeOrmModule],
  providers: [AmenitiyRepository, AmenityService, MealPlanRepository, MealPlanService, BedRepository, BedService],
  controllers: [AmenityController, BedController, MealPlanController],
})
export class InfoEntityModule {
}
