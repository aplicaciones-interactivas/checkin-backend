import { Body, Controller, Delete, Get, HttpCode, Injectable, Param, Patch, Post, Put, Query, UseGuards } from '@nestjs/common';
import { HotelService } from '../service/Hotel.service';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from '../auth/guards/Role.guard';
import { UserDecorator } from '../decorator/User.decorator';
import { HotelDto } from '../dto/hotel/Hotel.dto';
import { LoggedUserDto } from '../dto/user/LoggedUser.dto';
import { Hotel } from '../entities/Hotel';
import { HotelFilterDto } from '../dto/hotel/HotelFilter.dto';
import { Page } from '../entities/utils/Page';
import * as fetch from 'node-fetch';
import { CreateMealPlanPriceDto } from '../dto/mealPlan/CreateMealPlanPrice.dto';
import { UpdateMealPlanPriceDto } from '../dto/mealPlan/UpdateMealPlanPrice.dto';

@Injectable()
@Controller('hotel')
export class HotelController {

  private hotelService: HotelService;

  constructor(hotelService: HotelService) {
    this.hotelService = hotelService;
  }

  @Get('user')
  @UseGuards(AuthGuard('jwt'), new RoleGuard(['SUPERUSER', 'ADMIN']))
  findAllByUser(@UserDecorator() user: LoggedUserDto, @Query() filter: HotelFilterDto): Promise<Hotel[]> {
    return this.hotelService.findAllByUser(user, filter);
  }

  @Get('/id/:id')
  findById(@Param('id') id: number): Promise<Hotel> {
    return this.hotelService.findById(id);
  }

  @Get('')
  findAll(@Query() filter: HotelFilterDto): Promise<Hotel[]> {
    return this.hotelService.findByFilters(filter);
  }

  @Post('')
  @UseGuards(AuthGuard('jwt'), new RoleGuard(['SUPERUSER', 'ADMIN']))
  create(@Body() hotelRequest: HotelDto, @UserDecorator() user: LoggedUserDto): Promise<Hotel> {
    return this.hotelService.create(hotelRequest, user);
  }

  @Put('/:id')
  @UseGuards(AuthGuard('jwt'), new RoleGuard(['SUPERUSER', 'ADMIN']))
  update(@Param('id') id: number, @Body() hotelRequest: HotelDto, @UserDecorator() user: LoggedUserDto): Promise<Hotel> {
    return this.hotelService.update(id, hotelRequest, user);
  }

  @Delete('/:id')
  @HttpCode(204)
  @UseGuards(AuthGuard('jwt'), new RoleGuard(['SUPERUSER', 'ADMIN']))
  async delete(@Param('id') id: number, @UserDecorator() user: LoggedUserDto) {
    await this.hotelService.delete(id, user);
  }

  @Get('/price')
  public getBestPrice(@Query('hotelId') hotelId: number, @Query('from') from: string, @Query('until') until: string, @Query('occupancy') occupancy: number) {
    return this.hotelService.price(hotelId, from, until, occupancy);
  }

  @Get(':id/mealPlan')
  public getHotelMealPlan(@Param('id') id: number) {
    return this.hotelService.getHotelMealPlan(id);
  }

  @Patch('/:id/mealPlan')
  @UseGuards(AuthGuard('jwt'), new RoleGuard(['SUPERUSER', 'ADMIN']))
  public addMealPlans(@Param('id') id: number, @Body() mealPlanPrice: CreateMealPlanPriceDto[], @UserDecorator() user: LoggedUserDto) {
    return this.hotelService.addMealPlans(id, mealPlanPrice, user);
  }

  @Patch('/:id/mealPlan/:mealPlanId')
  @UseGuards(AuthGuard('jwt'), new RoleGuard(['SUPERUSER', 'ADMIN']))
  public updateMealPlan(@Param('id') id: number,
                        @Param('mealPlanId') mealPlanId: number,
                        @Body() mealPlanPrice: UpdateMealPlanPriceDto, @UserDecorator() user: LoggedUserDto) {
    return this.hotelService.updateMealPlan(id, mealPlanId, mealPlanPrice.price, user);
  }

  @Patch('/:id/mealPlan/:mealPlanId/desasociate')
  @UseGuards(AuthGuard('jwt'), new RoleGuard(['SUPERUSER', 'ADMIN']))
  public desasociateMealPlan(@Param('id') id: number, @Param('mealPlanId') mealPlanId: number, @UserDecorator() user: LoggedUserDto) {
    return this.hotelService.desasociateMealPlan(id, mealPlanId, user);

  }
}
