export class HotelDto {
  private _name: string;
  private _contactEmail: string;
  private _primaryContactPhone: string;
  private _secondaryContactPhone: string;
  private _checkinTime: string;
  private _checkoutTime: string;
  private _stars: number;
  private _category: string;
  private _country: string;
  private _city: string;
  private _address: string;
  private _amenitiesId: number[];
  private _mealPlansId: number[];
  private _userId: number;

  constructor(name: string, contactEmail: string, primaryContactPhone: string, secondaryContactPhone: string, checkinTime: string, checkoutTime: string, stars: number, category: string, country: string, city: string, address: string, amenitiesId: number[], mealPlansId: number[], userId: number) {
    this._name = name;
    this._contactEmail = contactEmail;
    this._primaryContactPhone = primaryContactPhone;
    this._secondaryContactPhone = secondaryContactPhone;
    this._checkinTime = checkinTime;
    this._checkoutTime = checkoutTime;
    this._stars = stars;
    this._category = category;
    this._country = country;
    this._city = city;
    this._address = address;
    this._amenitiesId = amenitiesId;
    this._mealPlansId = mealPlansId;
    this._userId = userId;
  }

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }

  get contactEmail(): string {
    return this._contactEmail;
  }

  set contactEmail(value: string) {
    this._contactEmail = value;
  }

  get primaryContactPhone(): string {
    return this._primaryContactPhone;
  }

  set primaryContactPhone(value: string) {
    this._primaryContactPhone = value;
  }

  get secondaryContactPhone(): string {
    return this._secondaryContactPhone;
  }

  set secondaryContactPhone(value: string) {
    this._secondaryContactPhone = value;
  }

  get checkinTime(): string {
    return this._checkinTime;
  }

  set checkinTime(value: string) {
    this._checkinTime = value;
  }

  get checkoutTime(): string {
    return this._checkoutTime;
  }

  set checkoutTime(value: string) {
    this._checkoutTime = value;
  }

  get stars(): number {
    return this._stars;
  }

  set stars(value: number) {
    this._stars = value;
  }

  get category(): string {
    return this._category;
  }

  set category(value: string) {
    this._category = value;
  }

  get country(): string {
    return this._country;
  }

  set country(value: string) {
    this._country = value;
  }

  get city(): string {
    return this._city;
  }

  set city(value: string) {
    this._city = value;
  }

  get address(): string {
    return this._address;
  }

  set address(value: string) {
    this._address = value;
  }

  get amenitiesId(): number[] {
    return this._amenitiesId;
  }

  set amenitiesId(value: number[]) {
    this._amenitiesId = value;
  }

  get mealPlansId(): number[] {
    return this._mealPlansId;
  }

  set mealPlansId(value: number[]) {
    this._mealPlansId = value;
  }

  get userId(): number {
    return this._userId;
  }

  set userId(value: number) {
    this._userId = value;
  }
}
