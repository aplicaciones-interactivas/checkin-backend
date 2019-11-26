import { Injectable } from '@nestjs/common';
import { Brackets, EntityManager, In, MoreThanOrEqual, SelectQueryBuilder } from 'typeorm';
import { HotelDto } from '../dto/hotel/Hotel.dto';
import { Hotel } from '../entities/Hotel';
import { Amenity } from '../entities/Amenity';
import { MealPlan } from '../entities/MealPlan';
import { User } from '../entities/User';
import { InjectEntityManager } from '@nestjs/typeorm';
import { HotelFilterDto } from '../dto/hotel/HotelFilter.dto';
import { Page } from '../entities/utils/Page';
import { Reservation } from '../entities/Reservation';
import { Room } from '../entities/Room';
import { from } from 'rxjs';
import { HotelMealPlan } from '../entities/HotelMealPlan';
import { CreateMealPlanPriceDto } from '../dto/mealPlan/CreateMealPlanPrice.dto';
import { number } from '@hapi/joi';

// @ts-ignore
declare type jsonObject = {
  [key: string]: any;
};

@Injectable()
export class HotelRepository {
  private entityManager: EntityManager;
  private static readonly DEFAULT_PAGE_SIZE: number = 18;

  constructor(@InjectEntityManager() entityManager: EntityManager) {
    this.entityManager = entityManager;
  }

  public async create(hotelRequest: HotelDto) {
    let hotel = this.entityManager.create(Hotel, hotelRequest);
    return this.entityManager.transaction(async entityManager => {
      hotel = await entityManager.save(Hotel, hotel);
      const amenities: Amenity[] = await entityManager.findByIds(Amenity, hotelRequest.amenitiesId);
      entityManager.createQueryBuilder()
        .relation(Hotel, 'amenities')
        .of(hotel)
        .add(amenities);
      return hotel;
    });
  }

  public async update(entityId: number, hotelRequest: HotelDto) {
    return this.entityManager.transaction(async entityManager => {
      const hotel = entityManager.create(Hotel, hotelRequest);
      await entityManager.update(Hotel, { where: { id: entityId } }, hotel);
      return entityManager.findOne(Hotel, entityId);
    });
  }

  public async delete(entityId: number) {
    await this.entityManager.delete(Hotel, { where: { id: entityId } });
  }

  public async findAllByUser(id: number, filter: HotelFilterDto): Promise<Hotel[]> {
    return this.buildPage({ ...filter, userId: id });
  }

  private async buildPage(filter): Promise<Hotel[]> {
    let qb: SelectQueryBuilder<Hotel> = this.entityManager.createQueryBuilder()
      .select('hotel').distinct(true)
      .from(Hotel, 'hotel');
    qb = await this.addFilters(qb, filter);
    const pageNumber = filter.page ? filter.page : 1;
    const pagePosition = (pageNumber - 1) * HotelRepository.DEFAULT_PAGE_SIZE;
    const totalSize = (await qb.getMany()).length;
    qb = qb.skip(pagePosition).take(HotelRepository.DEFAULT_PAGE_SIZE);
    return qb.getMany();
  }

  public async findAllByFilter(filter: HotelFilterDto) {
    return this.buildPage(filter);
  }

  public async findAll(filter: HotelFilterDto): Promise<Hotel[]> {
    return this.buildPage(filter);
  }

  public async findById(eId: number) {
    return this.entityManager.createQueryBuilder()
      .select('hotel')
      .from(Hotel, 'hotel')
      .leftJoinAndSelect('hotel.hotelImages', 'hi')
      .leftJoinAndSelect('hotel.amenities', 'a')
      .where('hotel.id= :id', { id: eId }).getOne();
  }

  private async addFilters(qb: SelectQueryBuilder<Hotel>, filter) {
    qb = qb.leftJoinAndSelect('hotel.amenities', 'amenities')
      .leftJoinAndSelect('hotel.hotelImages', 'hotelImages')
      .leftJoin('hotel.user', 'user')
      .leftJoin('hotel.rooms', 'rooms')
      .leftJoinAndSelect('rooms.roomType', 'roomType')
      .where('');
    if (filter.category && filter.category.length !== 0) {
      qb = qb.andWhere('hotel.category = :category', { category: filter.category });
    }
    if (filter.stars && filter.stars.length !== 0) {
      qb = qb.andWhere('hotel.stars in (:...stars)', { stars: filter.stars });
    }
    if (filter.city) {
      qb = qb.andWhere('hotel.city = :city', { city: filter.city });
    }
    if (filter.country) {
      qb = qb.andWhere('hotel.country = :country', { country: filter.country });
    }
    if (filter.occupancy) {
      qb = qb.andWhere('roomType.maxOcupancy >= :occupancy', { occupancy: filter.occupancy });
    }
    if (filter.guests) {
      qb = qb.andWhere('hotel.guests = :guests', { guests: filter.guests });
    }
    if (filter.amenities && filter.amenities.length !== 0) {
      qb = qb.andWhere('amenities.id in (:...amenities)', { amenities: filter.amenities })
        .leftJoinAndSelect('hotel.amenities', 'AllAmenities');
    }
    if (filter.name) {
      qb = qb.andWhere('hotel.name = :name', { name: filter.name });
    }
    if (filter.userId) {
      qb = qb.andWhere('hotel.user = :userId', { userId: filter.userId });
    }
    if (filter.from && filter.until) {
      const unavailablesRoomsQuery = await this.entityManager.createQueryBuilder()
        .from(Reservation, 'reservation')
        .innerJoin('reservation.room', 'room')
        .select('room.id').distinct(true)
        .where('reservation.from <=\'' + filter.from + '\' and reservation.until >=\'' + filter.from + '\'')
        .orWhere('reservation.from <=\'' + filter.until + '\' and reservation.until >=\'' + filter.until + '\'')
        .orWhere('reservation.from >=\'' + filter.from + '\' and reservation.from <=\'' + filter.until + '\'').getQuery();

      const availableHotelIdsQuery = await this.entityManager.createQueryBuilder()
        .select('room.hotelId').distinct(true)
        .from(Room, 'room')
        .where('room.id not in (' + unavailablesRoomsQuery + ')').getQuery();

      qb.andWhere('hotel.id in (' + availableHotelIdsQuery + ')');
    }
    return qb;

  }

  public async addMealPlans(mealPlanPriceDto: CreateMealPlanPriceDto, hotelId: number) {
    return this.entityManager.save(HotelMealPlan, this.mapMealPlanPriceDtoToHotelMealPlan(mealPlanPriceDto, hotelId));
  }

  private mapMealPlanPriceDtoToHotelMealPlan(mealPlanPriceDto: CreateMealPlanPriceDto, hotelId: number): HotelMealPlan {
    const hoterMealPlan: HotelMealPlan = this.entityManager.create(HotelMealPlan, mealPlanPriceDto);
    hoterMealPlan.hotelId = hotelId;
    return hoterMealPlan;
  }

  public async updateMealPlan(id: number, mPId: number, price: number) {
    const hotelMealPlan: HotelMealPlan = await this.entityManager.findOne(HotelMealPlan, {
      hotelId: id,
      mealPlanId: mPId,
    });
    hotelMealPlan.additionalPrice = price;
    return this.entityManager.save(HotelMealPlan, hotelMealPlan);
  }

  public async desasociate(id: number, mPId: number) {
    await this.entityManager.delete(HotelMealPlan, {
      hotelId: id,
      mealPlanId: mPId,
    });
  }

  public async getHotelMealPlan(searchHotelId: number): Promise<HotelMealPlan[]> {
    return this.entityManager.find(HotelMealPlan, {
      hotelId: searchHotelId,
    });
  }

  public async getHotelMealPlanById(hotelMealPlanId: number): Promise<HotelMealPlan> {
    return this.entityManager.findOne(HotelMealPlan, {
      id: hotelMealPlanId,
    });
  }
}
