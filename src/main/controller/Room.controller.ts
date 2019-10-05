import { Body, Controller, Injectable, Post } from '@nestjs/common';
import { RoomService } from '../service/Room.service';
import { Room } from '../entities/Room';
import { CreateRoomRequest } from '../api/request/room/CreateRoom.request';

@Injectable()
@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {
  }

  @Post()
  public create(@Body()roomRequest: CreateRoomRequest) {
    return this.roomService.create(roomRequest);
  }
}
