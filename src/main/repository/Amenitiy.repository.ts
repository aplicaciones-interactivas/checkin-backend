import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { Amenity } from '../entities/Amenity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AmenitiyRepository {

  constructor(@InjectEntityManager() private entityManager: EntityManager) {
  }

  public findAll() {
    return this.entityManager.find(Amenity);
  }
}
