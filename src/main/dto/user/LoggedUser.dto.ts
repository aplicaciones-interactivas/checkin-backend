export class LoggedUserDto {
  readonly id: number;
  readonly username: string;
  readonly roles: string[];

  constructor(id: number, username: string, roles: string[]) {
    this.id = id;
    this.username = username;
    this.roles = roles;
  }

}
