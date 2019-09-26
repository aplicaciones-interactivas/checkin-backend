import { Body, Controller, Injectable, Post } from '@nestjs/common';
import { RoomService } from '../service/Room.service';
import { Room } from '../entities/Room';
import { RoomRequest } from '../api/request/room/Room.request';

@Injectable()
@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {
  }

  @Post()
  public create(@Body()roomRequest: RoomRequest) {
    return this.roomService.create(roomRequest);
  }
}
