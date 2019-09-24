import { Injectable } from '@nestjs/common';
import { UserService } from './User.service';
import { JwtService } from '@nestjs/jwt';
import { BCryptUtils } from '../utils/BCrypt.utils';
import { LoginRequest } from '../api/request/auth/Login.request';

@Injectable()
export class AuthService {
  private userService: UserService;
  private jwtService: JwtService;

  constructor(userService: UserService, jwtService: JwtService) {
    this.userService = userService;
    this.jwtService = jwtService;
  }

  async login(loginRequest: LoginRequest) {
    const user = await this.userService.findByUsernameOrEmail(
      loginRequest.username,
    );
    if (user && BCryptUtils.compare(loginRequest.password, user.password)) {
      const payload = { username: user.username, sub: user.id, roles: user.roles.map(value => value.roleName) };
      return {
        access_token: this.jwtService.sign(payload),
      };
    }
  }
}
