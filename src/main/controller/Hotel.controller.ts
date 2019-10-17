import { Body, Controller, Delete, Get, HttpCode, Injectable, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { HotelService } from '../service/Hotel.service';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from '../auth/guards/Role.guard';
import { UserDecorator} from '../decorator/User.decorator';
import { HotelDto } from '../api/request/hotel/Hotel.dto';
import { LoggedUserDto } from '../api/request/user/LoggedUser.dto';

@Injectable()
@Controller('hotel')
export class HotelController {

  private hotelService: HotelService;

  constructor(hotelService: HotelService) {
    this.hotelService = hotelService;
  }

  @Get('user')
  @UseGuards(AuthGuard('jwt'), new RoleGuard(['SUPERUSER', 'ADMIN']))
  public findAllByUser(@UserDecorator() user: LoggedUserDto, @Query('page') page: number) {
    return this.hotelService.findAllByUser(user, page);
  }

  @Get('')
  public findAll(@Query('page') page: number) {
    return this.hotelService.findAll(page);
  }

  @Post('')
  @UseGuards(AuthGuard('jwt'), new RoleGuard(['SUPERUSER', 'ADMIN']))
  public create(@Body() hotelRequest: HotelDto, @UserDecorator() user: LoggedUserDto) {
    return this.hotelService.create(hotelRequest, user);
  }

  @Put('/:id')
  @UseGuards(AuthGuard('jwt'), new RoleGuard(['SUPERUSER', 'ADMIN']))
  public update(@Param('id') id: number, @Body() hotelRequest, @UserDecorator() user: LoggedUserDto) {
    return this.hotelService.update(id, hotelRequest, user);
  }

  @Delete('/:id')
  @HttpCode(204)
  @UseGuards(AuthGuard('jwt'), new RoleGuard(['SUPERUSER', 'ADMIN']))
  public delete(@Param('id') id: number, @UserDecorator() user: LoggedUserDto) {
    return this.hotelService.delete(id, user);
  }
}
