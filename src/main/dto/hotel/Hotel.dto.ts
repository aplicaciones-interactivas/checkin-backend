export class HotelDto {
  name: string;
  contactEmail: string;
  primaryContactPhone: string;
  secondaryContactPhone: string;
  checkinTime: string;
  checkoutTime: string;
  stars: number;
  category: string;
  country: string;
  city: string;
  address: string;
  amenitiesId: number[];
  removeAmenitiesId: number[];
  userId: number;
}
