import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { HotelDto } from '../api/request/hotel/Hotel.dto';
import { Hotel } from '../entities/Hotel';
import { Amenity } from '../entities/Amenity';
import { MealPlan } from '../entities/MealPlan';
import { User } from '../entities/User';
import { InjectEntityManager } from '@nestjs/typeorm';
import { HotelFilterDto } from '../api/request/hotel/HotelFilter.dto';

@Injectable()
export class HotelRepository {
  private entityManager: EntityManager;

  constructor(@InjectEntityManager() entityManager: EntityManager) {
    this.entityManager = entityManager;
  }

  public async create(hotelRequest: HotelDto) {
    let hotel = this.entityManager.create(Hotel, hotelRequest);
    return this.entityManager.transaction(async entityManager => {
      hotel = await entityManager.save(hotel);
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

  public async findAllByUser(id: number, page: number) {
    return this.entityManager.find(Hotel, { where: { userId: id }, skip: ((page - 1) * 10), take: 10 });
  }

  public async findAllByFilter(filter: HotelFilterDto) {
    return this.entityManager.find(Hotel, this.createWhereFromFilter(filter));
  }

  public async findAll(page: number) {
    return this.entityManager.find(Hotel, {
      skip: (((page ? page : 1) - 1) * 10),
      take: 10,
    });
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
    return {
      where: whereFilter,
      skip: (((filter.page ? filter.page : 1) - 1) * 10),
      take: 10,
    };
  }

}
