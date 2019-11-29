export class RoomTypeDto {
  type: string;
  maxOcupancy: number;
  surfaceArea: number;
  guests: number;
  hotelId: number;
  price: number;

  constructor(type: string, maxOcupancy: number, surfaceArea: number, guests: number, amenitiesIds: number[], hotelId: number, price: number) {
    this.type = type;
    this.maxOcupancy = maxOcupancy;
    this.surfaceArea = surfaceArea;
    this.guests = guests;
    this.hotelId = hotelId;
    this.price = price;
  }
}
