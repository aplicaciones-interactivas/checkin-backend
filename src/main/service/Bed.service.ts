import { Bed } from '../entities/Bed';
import { Injectable } from '@nestjs/common';
import { BedRepository } from '../repository/Bed.repository';

@Injectable()
export class BedService {
  constructor(private bedRepository: BedRepository) {
  }

  public findAll(): Promise<Bed[]> {
    return this.bedRepository.findAll();
  }
}
