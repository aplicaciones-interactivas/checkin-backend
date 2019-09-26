export class RoomRequest {
  type!: string;
  maxOcupancy?: number;
  surfaceArea?: number;
  guests?: number;
  amenityCodes?: string[];
  bedCodes?: string[];
}
