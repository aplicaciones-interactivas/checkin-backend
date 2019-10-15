import { Injectable } from '@nestjs/common';
import { AmenitiyRepository } from '../repository/Amenitiy.repository';

@Injectable()
export class AmenityService {
  constructor(private amenityRepository: AmenitiyRepository) {
  }

  public findAll() {
    return this.amenityRepository.findAll();
  }
}
