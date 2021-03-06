import { Injectable } from '@nestjs/common';
import { UserService } from './User.service';
import { JwtService } from '@nestjs/jwt';
import { BCryptUtils } from '../utils/BCrypt.utils';
import { LoginDto } from '../dto/auth/Login.dto';
import { LoggedUserDto } from '../dto/user/LoggedUser.dto';
import { AccessTokenDto } from '../dto/auth/AccessToken.dto';

@Injectable()
export class AuthService {
  private userService: UserService;
  private jwtService: JwtService;

  constructor(userService: UserService, jwtService: JwtService) {
    this.userService = userService;
    this.jwtService = jwtService;
  }

  async login(loginRequest: LoginDto): Promise<AccessTokenDto> {
    const user = await this.userService.findByUsernameOrEmail(
      loginRequest.username,
    );
    if (user && BCryptUtils.compare(loginRequest.password, user.password) && user.active) {
      const loggedUserDto: LoggedUserDto = new LoggedUserDto(user.id, user.username, user.roles.map(value => value.roleName));
      return new AccessTokenDto(this.jwtService.sign(Object.assign({}, loggedUserDto)));
    }
  }
}
