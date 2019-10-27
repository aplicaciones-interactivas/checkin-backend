import { EntityManager, Not, SelectQueryBuilder } from 'typeorm';
import { Room } from '../entities/Room';
import { Injectable } from '@nestjs/common';
import { Reservation } from '../entities/Reservation';

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
    return this.entityManager.findByIds(Room, roomIds);
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

  public async findAvailableByRoomType(id: number, from: Date, until: Date): Promise<Room[]> {

    const unavailablesRooms: string = await this.entityManager.createQueryBuilder().select()
      .select('reservation.roomId')
      .from(Reservation, 'reservation')
      .where('reservation.from <=\'' + from + '\' and reservation.until >=\'' + from + '\'')
      .orWhere('reservation.from <\'' + until + '\' and reservation.until >=\'' + until + '\'')
      .orWhere('reservation.from >=\'' + from + '\' and reservation.from <=\'' + until + '\'').getQuery();
    const selectQuery = this.entityManager.createQueryBuilder().select('room').from(Room, 'room')
      .where('roomTypeId = :roomTypeId', { roomTypeId: id });
    if (unavailablesRooms.length !== 0) {
      selectQuery.andWhere('id not in (' + unavailablesRooms + ')');
    }
    const result = await selectQuery.getMany();
    return result;
  }
}
