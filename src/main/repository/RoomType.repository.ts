import { RoomType } from '../entities/RoomType';
import { EntityManager } from 'typeorm';
import { InjectEntityManager } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Room } from '../entities/Room';
import { RoomTypeDto } from '../api/request/roomType/RoomType.dto';
import { Amenity } from '../entities/Amenity';
import { User } from '../entities/User';

@Injectable()
export class RoomTypeRepository {

  constructor(@InjectEntityManager() private entityManager: EntityManager) {
  }

  public async getRoomTypesByHotelId(id: number): Promise<RoomType[]> {
    return this.entityManager.find(RoomType, { where: { hotelId: id } });
  }

  private async save(entityId: number, roomTypeDto: RoomTypeDto): Promise<RoomType> {
    let roomType: RoomType = this.entityManager.create(RoomType, roomTypeDto);
    const ameminities: Amenity[] = await this.entityManager.findByIds(Amenity, roomTypeDto.amenitiesIds);
    return this.entityManager.transaction(async entityManager => {
      if (entityId) {
        await this.entityManager.update(RoomType, { where: { id: entityId } }, roomType);
        roomType = await this.entityManager.findOne(RoomType, roomType.id);
      } else {
        roomType = await this.entityManager.save(RoomType, roomType);
      }
      await entityManager
        .createQueryBuilder()
        .relation(RoomType, 'amenities')
        .of(roomType)
        .add(ameminities);
      return this.entityManager.findOne(RoomType, roomType.id);
    });
  }

  public async create(roomTypeDto: RoomTypeDto): Promise<RoomType> {
    return this.save(undefined, roomTypeDto);
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

  public async update(entityId: number, newRoomType: RoomTypeDto) {
    return this.save(entityId, newRoomType);
  }

  public async delete(entityId: number) {
    return this.entityManager.delete(RoomType, { where: { id: entityId } });
  }
}
