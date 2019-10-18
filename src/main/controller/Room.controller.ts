import { Body, Controller, Delete, Get, HttpCode, Injectable, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { RoomService } from '../service/Room.service';
import { Room } from '../entities/Room';
import { CreateRoomDto } from '../api/request/room/CreateRoom.dto';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from '../auth/guards/Role.guard';
import { UserDecorator } from '../decorator/User.decorator';
import { UpdateRoomDto } from '../api/request/room/UpdateRoom.dto';
import { LoggedUserDto } from '../api/request/user/LoggedUser.dto';

@Injectable()
@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {
  }

  @Post()
  @UseGuards(AuthGuard('jwt'), new RoleGuard(['SUPERUSER', 'ADMIN']))
  async create(@Body()roomRequest: CreateRoomDto, @UserDecorator() user: LoggedUserDto): Promise<Room[]> {
    return this.roomService.create(roomRequest, user);
  }

  @Put('/:id')
  @UseGuards(AuthGuard('jwt'), new RoleGuard(['SUPERUSER', 'ADMIN']))
  async update(@Param('id') id: number, @Body()roomRequest: UpdateRoomDto, @UserDecorator() user: LoggedUserDto): Promise<Room[]> {
    return this.roomService.update(roomRequest, user);
  }

  @Delete('/')
  @HttpCode(204)
  @UseGuards(AuthGuard('jwt'), new RoleGuard(['SUPERUSER', 'ADMIN']))
  async delete(@Query('ids') id: number[], @UserDecorator() user: LoggedUserDto) {
    await this.roomService.delete(id, user);
  }

  @Get('/:id')
  @UseGuards(AuthGuard('jwt'), new RoleGuard(['SUPERUSER', 'ADMIN']))
  public getByHotelId(@Param('id') id: number, @UserDecorator() user: LoggedUserDto): Promise<Room[]> {
    return this.roomService.findByHotelId(id, user);
  }
}
