import { Body, Controller, Delete, Get, Injectable, Param, Post, Put, UseGuards } from '@nestjs/common';
import { HotelService } from '../service/Hotel.service';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from '../auth/guards/Role.guard';
import { User } from '../decorator/User.decorator';
import { HotelRequest } from '../api/request/hotel/Hotel.request';

@Injectable()
@Controller('hotel')
export class HotelController {

  private hotelService: HotelService;

  constructor(hotelService: HotelService) {
    this.hotelService = hotelService;
  }

  @Get('user')
  @UseGuards(AuthGuard('jwt'), new RoleGuard(['SUPERUSER', 'ADMIN']))
  public findAllByUser(@User() user: any) {
    return this.hotelService.findAllByUser(user);
  }

  @Get('')
  public findAll() {
    return this.hotelService.findAll();
  }

  @Post('')
  @UseGuards(AuthGuard('jwt'), new RoleGuard(['SUPERUSER', 'ADMIN']))
  public create(@Body() hotelRequest: HotelRequest, @User() user: any) {
    return this.hotelService.create(hotelRequest);
  }

  @Put('/:id')
  @UseGuards(AuthGuard('jwt'), new RoleGuard(['SUPERUSER', 'ADMIN']))
  public update(@Param('id') id: number, @Body() hotelRequest, @User() user: any) {
    return this.hotelService.update(id, hotelRequest);
  }

  @Delete('/:id')
  @UseGuards(AuthGuard('jwt'), new RoleGuard(['SUPERUSER', 'ADMIN']))
  public delete(@Param('id') id: number, @User() user: any) {
    return this.hotelService.delete(id);
  }
}
