import { Injectable } from '@nestjs/common';
import { EntityManager, MoreThanOrEqual } from 'typeorm';
import { HotelDto } from '../api/request/hotel/Hotel.dto';
import { Hotel } from '../entities/Hotel';
import { Amenity } from '../entities/Amenity';
import { MealPlan } from '../entities/MealPlan';
import { User } from '../entities/User';
import { InjectEntityManager } from '@nestjs/typeorm';
import { HotelFilterDto } from '../api/request/hotel/HotelFilter.dto';
import { Page } from '../entities/utils/Page';

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

  public async findAllByUser(id: number, pageNumber: number): Promise<Page<Hotel>> {
    return this.buildPage({ page: pageNumber, userId: id });
  }

  private async buildPage(filter) {
    const page: Page<Hotel> = new Page();
    const dbFilter = this.createWhereFromFilter(filter);
    page.values = await this.entityManager.find(Hotel, this.createWhereFromFilter(filter));
    page.pages = Math.ceil((await this.entityManager.count(Hotel, { where: dbFilter.where })) / HotelRepository.DEFAULT_PAGE_SIZE);
    return page;
  }

  public async findAllByFilter(filter: HotelFilterDto) {
    return this.buildPage(this.createWhereFromFilter(filter));
  }

  public async findAll(requestedPage: number): Promise<Page<Hotel>> {
    return this.buildPage({ page: requestedPage });
  }

  public async findById(id: number) {
    return this.entityManager.findOne(Hotel, id);
  }

  private createWhereFromFilter(filter: HotelFilterDto) {
    const whereFilter: {
      [key: string]: any;
    } = {};
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
      whereFilter.stars = filter.stars;
    }
    if (filter.amenities) {
      whereFilter.amenities.id = filter.amenities;
    }
    if (filter.mealPlans) {
      whereFilter.mealPlans.id = filter.mealPlans;
    }
    if (filter.occupancy) {
      whereFilter.rooms.roomType.maxOcupancy = MoreThanOrEqual(filter.occupancy);
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
