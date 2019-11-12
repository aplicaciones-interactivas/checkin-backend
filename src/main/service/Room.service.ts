import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateRoomDto } from '../dto/room/CreateRoom.dto';
import { EntityManager } from 'typeorm';
import { Room } from '../entities/Room';
import { RoomType } from '../entities/RoomType';
import { UpdateRoomDto } from '../dto/room/UpdateRoom.dto';
import { PermissionUtils } from '../utils/Permission.utils';
import { User } from '../entities/User';
import { Hotel } from '../entities/Hotel';
import { RoomTypeService } from './RoomType.service';
import { RoomRepository } from '../repository/Room.repository';
import { InjectEntityManager } from '@nestjs/typeorm';
import { LoggedUserDto } from '../dto/user/LoggedUser.dto';

@Injectable()
export class RoomService {

  constructor(@InjectEntityManager() private entityManager: EntityManager, private roomRepository: RoomRepository, private roomTypeService: RoomTypeService) {
  }

  private async createRooms(roomRequest: CreateRoomDto): Promise<Room[]> {
    const roomType: RoomType = await this.roomTypeService.findById(roomRequest.roomTypeId);
    return roomRequest.numbers.map((num) => {
      const room: Room = new Room();
      room.number = num;
      room.roomTypeId = roomRequest.roomTypeId;
      room.hotelId = roomType.hotelId;
      return room;
    });
  }

  public async create(createRoomRequest: CreateRoomDto, user: LoggedUserDto): Promise<Room[]> {
    await this.validateAndContinue(createRoomRequest, user);
    return this.roomRepository.create(await this.createRooms(createRoomRequest));
  }

  public async update(updateRoomRequest: UpdateRoomDto, user: LoggedUserDto): Promise<Room[]> {
    await this.validateAndContinue(updateRoomRequest, user);
    return this.roomRepository.update(updateRoomRequest.roomIds, updateRoomRequest.roomTypeId);
  }

  public async delete(rooms: number[], user: LoggedUserDto) {
    this.validateAndContinue({ roomIds: rooms }, user);
    return this.roomRepository.delete(rooms);
  }

  public async findByHotelId(id: number, user: LoggedUserDto): Promise<Room[]> {
    this.validateAndContinue({ hotelId: id }, user);
    const roomTypeIds = (await this.roomTypeService.getRoomTypesByHotelId(id)).map(roomType => roomType.id);
    return this.roomRepository.findByRoomTypeId(roomTypeIds);
  }

  private async validateAndContinue(req: any, user: LoggedUserDto): Promise<void> {
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
      throw new UnauthorizedException();
    }
  }

  public findAvailableByRoomType(roomTypeId: number, from: Date, until: Date) {
    return this.roomRepository.findAvailableByRoomType(roomTypeId, from, until);
  }
}
