export class CreateUserDto {
  private _username!: string;
  private _password!: string;
  private _email!: string;
  private _rolesNames!: string[];

  constructor(username: string, password: string, email: string, rolesNames: string[]) {
    this._username = username;
    this._password = password;
    this._email = email;
    this._rolesNames = rolesNames;
  }

  get username(): string {
    return this._username;
  }

  set username(value: string) {
    this._username = value;
  }

  get password(): string {
    return this._password;
  }

  set password(value: string) {
    this._password = value;
  }

  get email(): string {
    return this._email;
  }

  set email(value: string) {
    this._email = value;
  }

  get rolesNames(): string[] {
    return this._rolesNames;
  }

  set rolesNames(value: string[]) {
    this._rolesNames = value;
  }
}
