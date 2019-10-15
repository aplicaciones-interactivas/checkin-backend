import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { HotelImage } from '../entities/HotelImage';

export class HotelImageRepository {
  constructor(@InjectEntityManager() private entityManager: EntityManager) {
  }

  public save(hotelImages: HotelImage[]): Promise<HotelImage[]> {
    return this.entityManager.save(HotelImage, hotelImages);
  }

  public findByIds(ids: number[]): Promise<HotelImage[]> {
    return this.entityManager.findByIds(HotelImage, ids);
  }

  public delete(ids: number[]) {
    return this.entityManager.delete(HotelImage, ids);
  }
}
