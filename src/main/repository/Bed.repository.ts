import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { Bed } from '../entities/Bed';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BedRepository {
  constructor(@InjectEntityManager() private entityManager: EntityManager) {
  }

  public findAll(): Promise<Bed[]> {
    return this.entityManager.find(Bed);
  }
}
