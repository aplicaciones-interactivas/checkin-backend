import { Column, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Amenity } from '../../../entities/Amenity';
import { Hotel } from '../../../entities/Hotel';

export class RoomTypeDto {
  type: string;
  maxOcupancy: number;
  surfaceArea: number;
  guests: number;
  amenitiesIds: number[];
  hotelId: number;
  price: number;

  constructor(type: string, maxOcupancy: number, surfaceArea: number, guests: number, amenitiesIds: number[], hotelId: number, price: number) {
    this.type = type;
    this.maxOcupancy = maxOcupancy;
    this.surfaceArea = surfaceArea;
    this.guests = guests;
    this.amenitiesIds = amenitiesIds;
    this.hotelId = hotelId;
    this.price = price;
  }
}
