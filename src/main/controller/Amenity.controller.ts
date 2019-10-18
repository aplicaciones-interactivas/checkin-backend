import { Controller, Get, Injectable } from '@nestjs/common';
import { AmenitiyRepository } from '../repository/Amenitiy.repository';
import { Amenity } from '../entities/Amenity';

@Controller('amenity')
export class AmenityController {
  constructor(private amenityRepository: AmenitiyRepository) {
  }

  @Get()
  async findAll(): Promise<Amenity[]> {
    return this.amenityRepository.findAll();
  }
}
