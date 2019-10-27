import { Injectable } from '@nestjs/common';
import { Brackets, EntityManager, In, MoreThanOrEqual, SelectQueryBuilder } from 'typeorm';
import { HotelDto } from '../api/request/hotel/Hotel.dto';
import { Hotel } from '../entities/Hotel';
import { Amenity } from '../entities/Amenity';
import { MealPlan } from '../entities/MealPlan';
import { User } from '../entities/User';
import { InjectEntityManager } from '@nestjs/typeorm';
import { HotelFilterDto } from '../api/request/hotel/HotelFilter.dto';
import { Page } from '../entities/utils/Page';
import { Reservation } from '../entities/Reservation';
import { Room } from '../entities/Room';
import { from } from 'rxjs';

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
      const mealPlans: MealPlan[] = await entityManager.findByIds(MealPlan, hotelRequest.mealPlansId);
      entityManager.createQueryBuilder()
        .relation(Hotel, 'amenities')
        .of(hotel)
        .add(amenities);
      entityManager.createQueryBuilder()
        .relation(Hotel, 'mealPlans')
        .of(hotel)
        .add(mealPlans);
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

  public async findAllByUser(id: number, filter: HotelFilterDto): Promise<Page<Hotel>> {
    return this.buildPage({ ...filter, userId: id });
  }

  private async buildPage(filter) {
    const page: Page<Hotel> = new Page();
    //   const dbFilter = this.createWhereFromFilter(filter);
    let qb: SelectQueryBuilder<Hotel> = this.entityManager.createQueryBuilder()
      .select('hotel').distinct(true)
      .from(Hotel, 'hotel');
    qb = await this.addFilters(qb, filter);
    const pageNumber = filter.page ? filter.page : 1;
    const pagePosition = (pageNumber - 1) * HotelRepository.DEFAULT_PAGE_SIZE;
    qb = qb.skip(pagePosition).take(HotelRepository.DEFAULT_PAGE_SIZE);
    page.values = await qb.getMany();
    page.pages = Math.ceil(page.values.length / HotelRepository.DEFAULT_PAGE_SIZE);
    page.page = pageNumber;
    return page;
  }

  public async findAllByFilter(filter: HotelFilterDto) {
    return this.buildPage(filter);
  }

  public async findAll(filter: HotelFilterDto): Promise<Page<Hotel>> {
    return this.buildPage(filter);
  }

  public async findById(id: number) {
    return this.entityManager.findOne(Hotel, id);
  }

  private async addFilters(qb: SelectQueryBuilder<Hotel>, filter) {
    qb = qb.leftJoin('hotel.mealPlans', 'mealPlans')
      .leftJoin('hotel.amenities', 'amenities')
      .leftJoin('hotel.hotelImages', 'hotelImages')
      .leftJoin('hotel.user', 'user')
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
    if (filter.mealPlans && filter.mealPlans.length !== 0) {
      qb = qb.andWhere('mealPlans.id in (:...mealPlans)', { mealPlans: filter.mealPlans })
        .leftJoinAndSelect('hotel.mealPlans', 'allMealPlans');
    }
    if (filter.occupancy) {
      qb = qb.andWhere('hotel.occupancy = :occupancy', { occupancy: filter.occupancy });
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

      qb.where('hotel.id in (' + availableHotelIdsQuery + ')');

    }
    /*

  from: string;
  to: string;
  page: number;
*/
    return qb;

  }

  private createWhereFromFilter(filter: HotelFilterDto) {
    const whereFilter: jsonObject = {};
    if (filter.category) {
      whereFilter.category = filter.category;
    }
    if (filter.city) {
      whereFilter.city = filter.city;
    }
    if (filter.country) {
      whereFilter.country = filter.country;
    }
    if (filter.stars) {
      const arrStars = [];
      arrStars.push(filter.stars);
      whereFilter.stars = In(arrStars);
    }
    if (filter.amenities) {
      whereFilter.amenities.id = filter.amenities;
    }
    if (filter.mealPlans) {
      whereFilter.mealPlans.id = filter.mealPlans;
    }
    if (filter.occupancy) {
      const rooms: jsonObject = {};
      const roomType: jsonObject = {};
      roomType.maxOcupancy = MoreThanOrEqual(filter.occupancy);
      rooms.roomType = roomType;
      whereFilter.rooms = rooms;
    }
    const dbFilter: {
      [key: string]: any;
    } = {
      skip: (((filter.page ? filter.page : 1) - 1) * HotelRepository.DEFAULT_PAGE_SIZE),
      take: HotelRepository.DEFAULT_PAGE_SIZE,
    };
    dbFilter.where = whereFilter;
    return dbFilter;
  }

}
