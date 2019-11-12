import { RoomTypeRepository } from '../repository/RoomType.repository';
import { RoomType } from '../entities/RoomType';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { PermissionUtils } from '../utils/Permission.utils';
import { Hotel } from '../entities/Hotel';
import { LoggedUserDto } from '../api/request/user/LoggedUser.dto';
import { RoomTypeDto } from '../api/request/roomType/RoomType.dto';

@Injectable()
export class RoomTypeService {
  constructor(@InjectEntityManager() private entityManager: EntityManager, private roomTypeRepository: RoomTypeRepository) {
  }

  public getRoomTypesByHotelId(id: number): Promise<RoomType[]> {
    return this.roomTypeRepository.getRoomTypesByHotelId(id);
  }

  public async create(roomType: RoomTypeDto, user: LoggedUserDto): Promise<RoomType> {
    await this.validateAndContinue(roomType, user);
    return this.roomTypeRepository.create(roomType);
  }

  public async getAvailables(hotelId: number, from: string, until: string, occupancy: number) {
    return await this.roomTypeRepository.getAvailables(hotelId, from, until, occupancy);
  }

  public findAllByUser(user: LoggedUserDto): Promise<RoomType[]> {
    return this.roomTypeRepository.findAllByUserId(user.id);
  }

  public findById(id: number) {
    return this.roomTypeRepository.findById(id);
  }

  public findAll(): Promise<RoomType[]> {
    return this.roomTypeRepository.findAll();
  }

  public async update(entityId: number, newRoomType: RoomTypeDto, user: LoggedUserDto): Promise<RoomType> {
    await this.validateAndContinue({ id: entityId }, user);
    return this.roomTypeRepository.update(entityId, newRoomType);
  }

  public async delete(entityId: number, user: LoggedUserDto): Promise<void> {
    await this.validateAndContinue({ id: entityId }, user);
    await this.roomTypeRepository.delete(entityId);
  }

  private async validateAndContinue(req, user: LoggedUserDto): Promise<void> {
    const hotelId = req.hotelId;
    const entityId = req.id;
    let isHotelOwner = true;
    if (hotelId) {
      isHotelOwner = await PermissionUtils.isOwner(this.entityManager, user, Hotel, hotelId);
    } else if (entityId) {
      const roomType = await this.roomTypeRepository.findById(entityId);
      isHotelOwner = await PermissionUtils.isOwner(this.entityManager, user, Hotel, roomType.hotelId);
    }
    if (!isHotelOwner) {
      throw new UnauthorizedException();
    }
  }
}
