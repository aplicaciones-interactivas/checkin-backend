export class UpdateRoomDto {
  private _roomIds: number[];
  private _roomTypeId: number;

  constructor(roomIds: number[], roomTypeId: number) {
    this._roomIds = roomIds;
    this._roomTypeId = roomTypeId;
  }

  get roomIds(): number[] {
    return this._roomIds;
  }

  set roomIds(value: number[]) {
    this._roomIds = value;
  }

  get roomTypeId(): number {
    return this._roomTypeId;
  }

  set roomTypeId(value: number) {
    this._roomTypeId = value;
  }
}
