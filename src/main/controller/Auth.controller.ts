import { Controller, Body, Post, UseGuards, Patch, Param, UseFilters } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../service/Auth.service';
import { LoginRequest } from '../api/request/auth/Login.request';
import { SignUpRequest } from '../api/request/auth/SignUp.request';
import { UserService } from '../service/User.service';
import { CreateUserRequest } from '../api/request/user/CreateUser.request';
import { getConnection } from 'typeorm';
import { RoleGuard } from '../auth/Role.guard';

@Controller('auth')
export class AuthController {
  private authService: AuthService;
  private userService: UserService;

  constructor(userService: UserService, authService: AuthService) {
    this.authService = authService;
    this.userService = userService;
  }

  @Post('login')
  async login(@Body() loginRequest: LoginRequest) {
    return this.authService.login(loginRequest);
  }

  @Post('signup')
  async signUp(@Body() signUpRequest: SignUpRequest) {
    return this.userService.signUp(signUpRequest);
  }

  @Patch('block/:id')
  async block(@Param('id') id: number) {
    return this.userService.block(id);
  }

  @Patch('unblock/:id')
  async unblock(@Param('id') id: number) {
    return this.userService.unblock(id);
  }
}
