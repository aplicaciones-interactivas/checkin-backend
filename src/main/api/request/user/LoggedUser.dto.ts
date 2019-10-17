export class LoggedUserDto {
  private readonly _id: number;
  private readonly _username: string;
  private readonly _roles: string[];

  constructor(id: number, username: string, roles: string[]) {
    this._id = id;
    this._username = username;
    this._roles = roles;
  }

  get id(): number {
    return this._id;
  }

  get username(): string {
    return this._username;
  }

  get roles(): string[] {
    return this._roles;
  }
}
