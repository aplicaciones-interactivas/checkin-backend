import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRoomRequest } from '../api/request/room/CreateRoom.request';
import { EntityManager } from 'typeorm';
import { Room } from '../entities/Room';
import { Amenity } from '../entities/Amenity';
import { RoomType } from '../entities/RoomType';
import { UpdateRoomRequest } from '../api/request/room/UpdateRoom.request';
import { PermissionUtils } from './permission-utils.service';
import { User } from '../entities/User';
import { boolean } from '@hapi/joi';
import { Hotel } from '../entities/Hotel';
import { RoomTypeService } from './RoomType.service';

@Injectable()
export class RoomService {

  constructor(private entityManager: EntityManager, private roomTypeService: RoomTypeService ) {
  }

  private createRooms(roomRequest: CreateRoomRequest): Room[] {
    return roomRequest.numbers.map((num) => {
      const room: Room = new Room();
      room.number = num;
      room.roomTypeId = roomRequest.roomTypeId;
      return room;
    });
  }

  public async create(createRoomRequest: CreateRoomRequest, user: User): Promise<Room[]> {
    await this.validateAndContinue(createRoomRequest, user);
    return this.entityManager.save(Room, this.createRooms(createRoomRequest));
  }

  private async validateAndContinue(req, user): Promise<void> {
    let isOwnerRoomType = true;
    let isOwnerRooms = true;
    let isOwnerHotel = true;
    if (req.roomTypeId) {
      isOwnerRoomType = await PermissionUtils.isOwner(this.entityManager, user, RoomType, req.roomTypeId);
    }
    if (req.roomIds) {
      isOwnerRooms = (await req.roomIds
        .filter(async (roomId) => PermissionUtils.isOwner(this.entityManager, user, Room, roomId))).length === 0;
    }
    if (req.hotelId) {
      isOwnerHotel = await PermissionUtils.isOwner(this.entityManager, user, Hotel, req.hotelId);
    }
    if (!isOwnerRoomType && !isOwnerRooms && !isOwnerHotel) {
      throw new BadRequestException('Invalid request' + req.roomTypeId);
    }
  }

  public async update(updateRoomRequest: UpdateRoomRequest, user: User): Promise<Room[]> {
    await this.validateAndContinue(updateRoomRequest, user);
    await this.entityManager.update(Room, {
      where: {
        id: updateRoomRequest.roomIds,
      },
    }, {
      roomTypeId: updateRoomRequest.roomTypeId,
    });
    return await this.entityManager.findByIds(Room, updateRoomRequest.roomIds);
  }

  public async delete(rooms: number[], user: User) {
    this.validateAndContinue({ roomIds: rooms }, user);
    await this.entityManager.delete(Room, {
      where: {
        id: rooms,
      },
    });
  }

  public async findByHotelId(id: number, user: User): Promise<Room[]> {
    this.validateAndContinue({ hotelId: id }, user);
    const roomTypeIds = (await this.roomTypeService.getRoomTypesByHotelId(id)).map(roomType => roomType.id);
    return this.entityManager.find(Room, {where: {roomTypeId: roomTypeIds}});
  }
}
