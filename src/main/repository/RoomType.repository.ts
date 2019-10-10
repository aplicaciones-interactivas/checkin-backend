import { RoomType } from '../entities/RoomType';
import { EntityManager } from 'typeorm';
import { InjectEntityManager } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Room } from '../entities/Room';

@Injectable()
export class RoomTypeRepository {

  constructor(@InjectEntityManager() private entityManager: EntityManager) {
  }

  public async getRoomTypesByHotelId(id: number): Promise<RoomType[]> {
    return this.entityManager.find(RoomType, { where: { hotelId: id } });
  }

  public async create(roomType: RoomType): Promise<RoomType> {
    return this.entityManager.save(RoomType, roomType);
  }

  public async findById(id: number): Promise<RoomType> {
    return this.entityManager.findOne(RoomType, id);
  }

  public async findAll(): Promise<RoomType[]> {
    return this.entityManager.find(RoomType);
  }

  public async findAllByUserId(id: number): Promise<RoomType[]> {
    return this.entityManager.find(RoomType, {
      where: {
        hotel: {
          userId: id,
        },
      },
    });
  }

  public async update(entityId: number, newRoomType: RoomType) {
    await this.entityManager.update(RoomType, { where: { id: entityId } }, newRoomType);
    return this.entityManager.findOne(RoomType, { where: { id: entityId } });
  }

  public async delete(entityId: number) {
    return this.entityManager.delete(RoomType, { where: { id: entityId } });
  }
}
