export class CreateReservationDto {
  roomTypeId: number;
  from!: Date;
  until!: Date;
  mealPlanId: number;
  userId: number;
}
