export class CreateRoomDto {
  roomTypeId: number;
  numbers: number[];

  constructor(roomTypeId: number, numbers: number[]) {
    this.roomTypeId = roomTypeId;
    this.numbers = numbers;
  }

}
