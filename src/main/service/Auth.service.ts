import { Injectable } from '@nestjs/common';
import { UserService } from './User.service';
import { JwtService } from '@nestjs/jwt';
import { BCryptUtils } from '../utils/BCrypt.utils';
import { LoginDto } from '../api/request/auth/Login.dto';
import { LoggedUserDto } from '../api/request/user/LoggedUser.dto';

@Injectable()
export class AuthService {
  private userService: UserService;
  private jwtService: JwtService;

  constructor(userService: UserService, jwtService: JwtService) {
    this.userService = userService;
    this.jwtService = jwtService;
  }

  async login(loginRequest: LoginDto) {
    const user = await this.userService.findByUsernameOrEmail(
      loginRequest.username,
    );
    if (user && BCryptUtils.compare(loginRequest.password, user.password) && user.active) {
      const loggedUserDto: LoggedUserDto = new LoggedUserDto(user.id, user.username, user.roles.map(value => value.roleName));
      return {
        access_token: this.jwtService.sign(Object.assign({}, loggedUserDto)),
      };
    }
  }
}
