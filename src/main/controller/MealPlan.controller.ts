import { Controller, Get, Injectable, Param, Patch, UseGuards } from '@nestjs/common';
import { MealPlan } from '../entities/MealPlan';
import { MealPlanRepository } from '../repository/MealPlan.repository';
import { MealPlanService } from '../service/MealPlan.service';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from '../auth/guards/Role.guard';
import { UserDecorator } from '../decorator/User.decorator';
import { LoggedUserDto } from '../dto/user/LoggedUser.dto';
import { HotelMealPlan } from '../entities/HotelMealPlan';

@Controller('meal-plan')
export class MealPlanController {
  constructor(private mealPlanService: MealPlanService) {
  }

  @Get('all')
  public findAll(): Promise<MealPlan[]> {
    return this.mealPlanService.findAll();
  }

  @Get()
  @UseGuards(AuthGuard('jwt'), new RoleGuard(['SUPERUSER', 'ADMIN']))
  public findByUser(@UserDecorator() user: LoggedUserDto): Promise<HotelMealPlan[]> {
    return this.mealPlanService.findAllByUserId(user.id);
  }

  @Get('/id/:id')
  public findById(@Param() id: number): Promise<HotelMealPlan> {
    return this.mealPlanService.findById(id);
  }
}
