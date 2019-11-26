export class CreateReservationDto {
  roomTypeId: number;
  from!: string;
  until!: string;
  mealPlanId: number;
  userId: number;
  totalPrice: number;
}
