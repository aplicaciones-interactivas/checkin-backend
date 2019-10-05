import { Injectable } from '@nestjs/common';
import { CreateRoomRequest } from '../api/request/room/CreateRoom.request';
import { EntityManager } from 'typeorm';
import { Room } from '../entities/Room';
import { Amenity } from '../entities/Amenity';
import { RoomType } from '../entities/RoomType';
import { UpdateRoomRequest } from '../api/request/room/UpdateRoom.request';

@Injectable()
export class RoomService {

  private entityManager: EntityManager;

  constructor(entityManager: EntityManager) {
    this.entityManager = entityManager;
  }

  private createRooms(roomRequest: CreateRoomRequest): Room[] {
    return roomRequest.numbers.map((num) => {
      const room: Room = new Room();
      room.number = num;
      room.roomTypeId = roomRequest.roomTypeId;
      return room;
    });
  }

  public async create(createRoomRequest: CreateRoomRequest): Promise<Room[]> {
    return await this.entityManager.save(Room, this.createRooms(createRoomRequest));
  }

  public async update(updateRoomRequest: UpdateRoomRequest): Promise<Room[]> {
    await this.entityManager.update(Room, {
      where: {
        id: updateRoomRequest.roomIds,
      },
    }, {
      roomTypeId: updateRoomRequest.roomTypeId,
    });
    return await this.entityManager.findByIds(Room, updateRoomRequest.roomIds);
  }

  public async delete(roomIds: number[]) {
    await this.entityManager.delete(Room, {
      where: {
        id: roomIds,
      },
    });
  }

  /*private async getTypeOrCreate(roomRequest: CreateRoomRequest, entityManager): Promise<number> {
      const existingRoomType = await entityManager.find({
        where: {
          hotelId: roomRequest.hotelId,
          name: roomRequest.roomType,
        },
      });
      if (existingRoomType) {
        return existingRoomType.id;
      } else {
        let newRoomType = entityManager.create(RoomType, roomRequest);
        const roomTypeId = (await entityManager.insert(RoomType, newRoomType)).raw.insertId;
        newRoomType = (await entityManager.findById(roomTypeId));
        const amenities: Amenity[] = await entityManager.find(Amenity, {
          where: {
            code: roomRequest.amenityCodes,
          },
        });
        await entityManager.createQueryBuilder()
          .relation(RoomType, 'amenities')
          .of(newRoomType)
          .add(amenities);
        return roomTypeId;
      }
    }*/
}
