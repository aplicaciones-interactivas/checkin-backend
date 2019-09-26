import { Injectable } from '@nestjs/common';
import { RoomRequest } from '../api/request/room/Room.request';
import { EntityManager } from 'typeorm';
import { Room } from '../entities/Room';
import { Amenity } from '../entities/Amenity';


@Injectable()
export class RoomService {

  private entityManager: EntityManager;

  constructor(entityManager: EntityManager) {
    this.entityManager = entityManager;
  }

  public async create(roomRequest: RoomRequest): Promise<Room> {
    return await this.entityManager.transaction(async entityManager => {
      const room = entityManager.create(Room, roomRequest);
      const roomId = (await entityManager.insert(Room, room)).raw.insertId;
      const amenities: Amenity[] = await entityManager.find(Amenity, {
        where: {
          code: roomRequest.amenityCodes,
        },
      });
      const savedRoom: Room = await entityManager.findOne(Room, {
        where: {
          id: roomId,
        },
      });
      await entityManager.createQueryBuilder()
        .relation(Room, 'amenities')
        .of(savedRoom)
        .add(amenities);
      return savedRoom;
    });
  }
}
