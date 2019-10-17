export class UpdateUserDto {
  private _password!: string;
  private _email!: string;

  constructor(password: string, email: string) {
    this._password = password;
    this._email = email;
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
}
