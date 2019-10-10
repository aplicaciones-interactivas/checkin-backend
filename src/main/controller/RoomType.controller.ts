import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { RoomTypeService } from '../service/RoomType.service';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from '../auth/guards/Role.guard';
import { User } from '../decorator/User.decorator';
import { RoomType } from '../entities/RoomType';

@Controller('room-type')
export class RoomTypeController {

  constructor(private roomTypeService: RoomTypeService) {
  }

  @Get()
  @UseGuards(AuthGuard('jwt'), new RoleGuard(['SUPERUSER', 'ADMIN']))
  public findAll(@User() user: any) {
    if (user.roles.map(role => role.roleName).includes('ADMIN')) {
      return this.roomTypeService.findAllByUser(user);
    } else {
      return this.roomTypeService.findAll();
    }
  }

  @Post()
  @UseGuards(AuthGuard('jwt'), new RoleGuard(['SUPERUSER', 'ADMIN']))
  public create(@Body() roomType: RoomType, @User() user: any) {
    return this.roomTypeService.create(roomType, user);
  }

  @Put('/:id')
  @UseGuards(AuthGuard('jwt'), new RoleGuard(['SUPERUSER', 'ADMIN']))
  public update(@Param('id') id: number, @Body() roomType: RoomType, @User() user: any) {
    return this.roomTypeService.update(id, roomType, user);
  }

  @Delete('/:id')
  @UseGuards(AuthGuard('jwt'), new RoleGuard(['SUPERUSER', 'ADMIN']))
  public delete(@Param('id') id: number, @User() user: any) {
    return this.roomTypeService.delete(id, user);
  }

}
