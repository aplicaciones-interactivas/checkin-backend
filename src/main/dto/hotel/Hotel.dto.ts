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
  userId: number;

  constructor(name: string, contactEmail: string, primaryContactPhone: string, secondaryContactPhone: string, checkinTime: string, checkoutTime: string, stars: number, category: string, country: string, city: string, address: string, amenitiesId: number[], userId: number) {
    this.name = name;
    this.contactEmail = contactEmail;
    this.primaryContactPhone = primaryContactPhone;
    this.secondaryContactPhone = secondaryContactPhone;
    this.checkinTime = checkinTime;
    this.checkoutTime = checkoutTime;
    this.stars = stars;
    this.category = category;
    this.country = country;
    this.city = city;
    this.address = address;
    this.amenitiesId = amenitiesId;
    this.userId = userId;
  }
}
