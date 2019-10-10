import { EntityManager } from 'typeorm';
import { Room } from '../entities/Room';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RoomRepository {
  constructor(private entityManager: EntityManager) {
  }

  public async create(room: Room[]): Promise<Room[]> {
    return this.entityManager.save(Room, room);
  }

  public async update(roomIds: number[], newRoomTypeId: number): Promise<Room[]> {
    await this.entityManager.update(Room, {
      where: {
        id: roomIds,
      },
    }, {
      roomTypeId: newRoomTypeId,
    });
    return await this.entityManager.findByIds(Room, roomIds);
  }

  public async delete(roomIds: number[]) {
    await this.entityManager.delete(Room, {
      where: {
        id: roomIds,
      },
    });
  }

  public async findByRoomTypeId(roomTypeIds: number[]): Promise<Room[]> {
    return this.entityManager.find(Room, { where: { roomTypeId: roomTypeIds } });
  }
}
