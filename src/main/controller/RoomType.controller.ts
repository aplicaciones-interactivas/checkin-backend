import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { RoomTypeService } from '../service/RoomType.service';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from '../auth/guards/Role.guard';
import { UserDecorator } from '../decorator/User.decorator';
import { RoomType } from '../entities/RoomType';
import { LoggedUserDto } from '../dto/user/LoggedUser.dto';
import { PermissionUtils } from '../utils/Permission.utils';
import { RoomTypeDto } from '../dto/roomType/RoomType.dto';

@Controller('room-type')
export class RoomTypeController {

  constructor(private roomTypeService: RoomTypeService) {
  }

  @Get()
  @UseGuards(AuthGuard('jwt'), new RoleGuard(['SUPERUSER', 'ADMIN']))
  public findAll(@UserDecorator() user: LoggedUserDto): Promise<RoomType[]> {
    if (PermissionUtils.hasRole(user, 'ADMIN')) {
      return this.roomTypeService.findAllByUser(user);
    } else {
      return this.roomTypeService.findAll();
    }
  }

  @Post()
  @UseGuards(AuthGuard('jwt'), new RoleGuard(['SUPERUSER', 'ADMIN']))
  async create(@Body() roomType: RoomTypeDto, @UserDecorator() user: LoggedUserDto): Promise<RoomType> {
    return this.roomTypeService.create(roomType, user);
  }

  @Get('availables')
  public getAvailable(@Query('hotelId') hotelId: number, @Query('from') from: string, @Query('until') until: string, @Query('occupancy') occupancy: number) {
    return this.roomTypeService.getAvailables(hotelId, from, until, occupancy);
  }

  @Put('/:id')
  @UseGuards(AuthGuard('jwt'), new RoleGuard(['SUPERUSER', 'ADMIN']))
  public update(@Param('id') id: number, @Body() roomType: RoomTypeDto, @UserDecorator() user: LoggedUserDto) {
    return this.roomTypeService.update(id, roomType, user);
  }

  @Delete('/:id')
  @HttpCode(204)
  @UseGuards(AuthGuard('jwt'), new RoleGuard(['SUPERUSER', 'ADMIN']))
  public delete(@Param('id') id: number, @UserDecorator() user: LoggedUserDto) {
    return this.roomTypeService.delete(id, user);
  }

  @Get('/hotel/:hotelId/:id')
  public getByIdAndHotelId(@Param('hotelId') hotelId: number, @Param('id') id: number) {
    return this.roomTypeService.getByIdAndHotelId(id, hotelId);
  }

}
