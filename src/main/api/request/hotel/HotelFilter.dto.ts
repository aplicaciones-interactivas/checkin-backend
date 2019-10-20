export class HotelFilterDto {
  stars: number[];
  category: string;
  country: string;
  city: string;
  amenities: number[];
  mealPlans: number[];
  name: string;
  from: string;
  to: string;
  page: number;

  constructor(stars: number[], category: string, country: string, city: string, amenities: number[], mealPlans: number[], name: string, from: string, to: string, page: number) {
    this.stars = stars;
    this.category = category;
    this.country = country;
    this.city = city;
    this.amenities = amenities;
    this.mealPlans = mealPlans;
    this.name = name;
    this.from = from;
    this.to = to;
    this.page = page;
  }
}
