export class UpdateRoomDto {
  roomIds: number[];
  roomTypeId: number;

  constructor(roomIds: number[], roomTypeId: number) {
    this.roomIds = roomIds;
    this.roomTypeId = roomTypeId;
  }
}
