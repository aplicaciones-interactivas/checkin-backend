export class CreateRoomDto {
  private _roomTypeId: number;
  private _numbers: number[];

  constructor(roomTypeId: number, numbers: number[]) {
    this._roomTypeId = roomTypeId;
    this._numbers = numbers;
  }

  get roomTypeId(): number {
    return this._roomTypeId;
  }

  set roomTypeId(value: number) {
    this._roomTypeId = value;
  }

  get numbers(): number[] {
    return this._numbers;
  }

  set numbers(value: number[]) {
    this._numbers = value;
  }
}
