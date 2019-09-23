import { Controller, Body, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../service/Auth.service';
import { LoginRequest } from '../api/request/auth/Login.request';
import { SignUpRequest } from '../api/request/auth/SignUp.request';
import { UserService } from '../service/User.service';
import { CreateUserRequest } from '../api/request/user/CreateUser.request';
import { getConnection } from 'typeorm';

@Controller('api')
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
    const createUserRequest: CreateUserRequest = new CreateUserRequest();
    createUserRequest.email = signUpRequest.email;
    createUserRequest.password = signUpRequest.password;
    createUserRequest.username = signUpRequest.username;
    createUserRequest.rolesId = [2];
    return this.userService.create(createUserRequest);
  }
}
