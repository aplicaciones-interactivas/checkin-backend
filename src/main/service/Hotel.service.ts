import { Injectable, UnauthorizedException } from '@nestjs/common';
import { HotelDto } from '../dto/hotel/Hotel.dto';
import { HotelRepository } from '../repository/Hotel.repository';
import { LoggedUserDto } from '../dto/user/LoggedUser.dto';
import { PermissionUtils } from '../utils/Permission.utils';
import { HotelFilterDto } from '../dto/hotel/HotelFilter.dto';
import { Hotel } from '../entities/Hotel';
import { RoomTypeService } from './RoomType.service';
import { PriceDto } from '../dto/price/PriceDto';

@Injectable()
export class HotelService {
  hotelRepository: HotelRepository;
  roomTypeService: RoomTypeService;

  constructor(hotelRepository: HotelRepository, roomTypeService: RoomTypeService) {
    this.hotelRepository = hotelRepository;
    this.roomTypeService = roomTypeService;
  }

  private validateAndContinue(hotelOwner: number, user: LoggedUserDto) {
    if (hotelOwner) {
      if (hotelOwner !== user.id && !PermissionUtils.hasRole(user, 'SUPERUSER')) {
        throw new UnauthorizedException();
      }
    }
  }

  public async findById(id: number): Promise<Hotel> {
    return this.hotelRepository.findById(id);
  }

  public async create(hotelRequest: HotelDto, user: LoggedUserDto) {
    if (!PermissionUtils.hasRole(user, 'SUPERUSER')) {
      hotelRequest.userId = user.id;
    }
    return this.hotelRepository.create(hotelRequest);
  }

  public async update(entityId: number, hotelRequest: HotelDto, user: LoggedUserDto) {
    const hotel = await this.hotelRepository.findById(entityId);
    this.validateAndContinue(hotel.userId, user);
    return this.hotelRepository.update(entityId, hotelRequest);
  }

  public async delete(entityId: number, user: LoggedUserDto) {
    const hotel = await this.hotelRepository.findById(entityId);
    this.validateAndContinue(hotel.userId, user);
    await this.hotelRepository.delete(entityId);
  }

  public async findAll(pageNumber: number) {
    const filter: HotelFilterDto = new HotelFilterDto();
    filter.page = pageNumber;
    return this.hotelRepository.findAll(filter);
  }

  public async findAllByUser(user: LoggedUserDto, filter: HotelFilterDto) {
    if (PermissionUtils.hasRole(user, 'SUPERUSER')) {
      return this.hotelRepository.findAll(filter);
    }
    return this.hotelRepository.findAllByUser(user.id, filter);
  }

  public async findByFilters(filters: HotelFilterDto) {
    return this.hotelRepository.findAllByFilter(filters);
  }

  public async price(hotelId: number, from: string, until: string, maxOccupancy: number) {
    const roomTypes = await this.roomTypeService.getAvailables(hotelId, from, until, maxOccupancy);
    const price = new PriceDto();
    price.price = roomTypes.sort((a, b) => {
      if (a.price < b.price) {
        return -1;
      }
      if (a.price > b.price) {
        return 1;
      }
      return 0;
    })[0].price;
    return price;
  }

}
