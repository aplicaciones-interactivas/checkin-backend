import { Bed } from '../entities/Bed';
import { Controller, Get, Injectable } from '@nestjs/common';
import { BedRepository } from '../repository/Bed.repository';
import { BedService } from '../service/Bed.service';

@Controller('bed')
export class BedController {
  constructor(private bedService: BedService) {
  }

  @Get()
  public findAll(): Promise<Bed[]> {
    return this.bedService.findAll();
  }
}
