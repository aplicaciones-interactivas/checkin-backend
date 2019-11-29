import { RoomType } from '../entities/RoomType';
import { EntityManager } from 'typeorm';
import { InjectEntityManager } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Room } from '../entities/Room';
import { RoomTypeDto } from '../dto/roomType/RoomType.dto';
import { Amenity } from '../entities/Amenity';
import { User } from '../entities/User';
import { Reservation } from '../entities/Reservation';

@Injectable()
export class RoomTypeRepository {

  constructor(@InjectEntityManager() private entityManager: EntityManager) {
  }

  public async getRoomTypesByHotelId(id: number): Promise<RoomType[]> {
    return this.entityManager.find(RoomType, { where: { hotelId: id } });
  }

  public async getAvailables(hotelId: number, from: string, until: string, occupancy: number) {
    const unavailablesRoomsQueue = this.entityManager.createQueryBuilder()
      .from(Room, 'room')
      .innerJoin('room.reservations', 'reservation')
      .select('room.id').distinct(true)
      .where('(reservation.from <=\'' + from + '\' and reservation.until >=\'' + from + '\')')
      .orWhere('(reservation.from <=\'' + until + '\' and reservation.until >=\'' + until + '\')')
      .orWhere('(reservation.from >=\'' + from + '\' and reservation.from <=\'' + until + '\')')
      .getQuery();

    const availableRoomTypesQueue = this.entityManager.createQueryBuilder()
      .from(Room, 'room')
      .where('room.id not in (' + unavailablesRoomsQueue + ')')
      .select('room.roomTypeId').distinct(true).getQuery();

    return this.entityManager.createQueryBuilder()
      .from(RoomType, 'roomType')
      .select('roomType')
      .where('roomType.id in (' + availableRoomTypesQueue + ')')
      .andWhere('roomType.hotelId = :id', { id: hotelId })
      .andWhere('roomType.maxOcupancy >= :oc', { oc: occupancy })
      .getMany();
  }

  private async save(entityId: number, roomTypeDto: RoomTypeDto): Promise<RoomType> {
    let roomType: RoomType = this.entityManager.create(RoomType, roomTypeDto);
    return this.entityManager.transaction(async entityManager => {
      if (!!entityId) {
        await this.entityManager.update(RoomType, entityId, roomType);
        roomType = await this.entityManager.findOne(RoomType, roomType.id);
      } else {
        roomType = await this.entityManager.save(RoomType, roomType);
      }
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

  public async findAllByUserId(userId: number): Promise<RoomType[]> {
    return this.entityManager.createQueryBuilder()
      .from(RoomType, 'roomType')
      .select('roomType')
      .leftJoinAndSelect('roomType.rooms', 'rooms')
      .innerJoinAndSelect('roomType.hotel', 'hotel')
      .where('hotel.userId = :id', { id: userId }).getMany();
  }

  public async update(entityId: number, newRoomType: RoomTypeDto) {
    return this.save(entityId, newRoomType);
  }

  public async delete(entityId: number) {
    return this.entityManager.delete(RoomType, { where: { id: entityId } });
  }

  public async getByIdAndHotelId(eId: number, hId: number) {
    return this.entityManager.findOne(RoomType, {
      id: eId, hotelId: hId,
    }, { relations: ['hotel', 'rooms'] });

  }
}
