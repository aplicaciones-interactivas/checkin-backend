export class CreateUserDto {
  username!: string;
  password!: string;
  email!: string;
  rolesNames!: string[];

  constructor(username: string, password: string, email: string, rolesNames: string[]) {
    this.username = username;
    this.password = password;
    this.email = email;
    this.rolesNames = rolesNames;
  }
}
