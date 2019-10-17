import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards } from '@nestjs/common';
import { RoomTypeService } from '../service/RoomType.service';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from '../auth/guards/Role.guard';
import { UserDecorator } from '../decorator/User.decorator';
import { RoomType } from '../entities/RoomType';
import { LoggedUserDto } from '../api/request/user/LoggedUser.dto';
import { PermissionUtils } from '../utils/Permission.utils';

@Controller('room-type')
export class RoomTypeController {

  constructor(private roomTypeService: RoomTypeService) {
  }

  @Get()
  @UseGuards(AuthGuard('jwt'), new RoleGuard(['SUPERUSER', 'ADMIN']))
  public findAll(@UserDecorator() user: LoggedUserDto) {
    if (PermissionUtils.hasRole(user, 'ADMIN')) {
      return this.roomTypeService.findAllByUser(user);
    } else {
      return this.roomTypeService.findAll();
    }
  }

  @Post()
  @UseGuards(AuthGuard('jwt'), new RoleGuard(['SUPERUSER', 'ADMIN']))
  public create(@Body() roomType: RoomType, @UserDecorator() user: LoggedUserDto) {
    return this.roomTypeService.create(roomType, user);
  }

  @Put('/:id')
  @UseGuards(AuthGuard('jwt'), new RoleGuard(['SUPERUSER', 'ADMIN']))
  public update(@Param('id') id: number, @Body() roomType: RoomType, @UserDecorator() user: LoggedUserDto) {
    return this.roomTypeService.update(id, roomType, user);
  }

  @Delete('/:id')
  @HttpCode(204)
  @UseGuards(AuthGuard('jwt'), new RoleGuard(['SUPERUSER', 'ADMIN']))
  public delete(@Param('id') id: number, @UserDecorator() user: LoggedUserDto) {
    return this.roomTypeService.delete(id, user);
  }

}
