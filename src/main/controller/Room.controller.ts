import { Body, Controller, Delete, Get, Injectable, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { RoomService } from '../service/Room.service';
import { Room } from '../entities/Room';
import { CreateRoomRequest } from '../api/request/room/CreateRoom.request';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from '../auth/guards/Role.guard';
import { User } from '../decorator/User.decorator';
import { UpdateRoomRequest } from '../api/request/room/UpdateRoom.request';

@Injectable()
@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {
  }

  @Post()
  @UseGuards(AuthGuard('jwt'), new RoleGuard(['SUPERUSER', 'ADMIN']))
  public create(@Body()roomRequest: CreateRoomRequest, @User() user: any) {
    return this.roomService.create(roomRequest, user);
  }

  @Put('/:id')
  @UseGuards(AuthGuard('jwt'), new RoleGuard(['SUPERUSER', 'ADMIN']))
  public update(@Param('id') id: number, @Body()roomRequest: UpdateRoomRequest, @User() user: any) {
    return this.roomService.update(roomRequest, user);
  }

  @Delete('/')
  @UseGuards(AuthGuard('jwt'), new RoleGuard(['SUPERUSER', 'ADMIN']))
  public delete(@Query('ids') id: number[], @User() user: any) {
    return this.roomService.delete(id, user);
  }

  @Get('/:id')
  @UseGuards(AuthGuard('jwt'), new RoleGuard(['SUPERUSER', 'ADMIN']))
  public getByHotelId(@Param('id') id: number, @User() user: any) {
    return this.roomService.findByHotelId(id, user);
  }
}
