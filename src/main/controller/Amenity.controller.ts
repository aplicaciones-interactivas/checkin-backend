import { Controller, Get, Injectable } from '@nestjs/common';
import { AmenitiyRepository } from '../repository/Amenitiy.repository';

@Controller('amenity')
export class AmenityController {
  constructor(private amenityRepository: AmenitiyRepository) {
  }

  @Get()
  public findAll() {
    return this.amenityRepository.findAll();
  }
}
