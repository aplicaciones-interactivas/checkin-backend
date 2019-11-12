import { Controller, Body, Post, UseGuards, Patch, Param, UseFilters, HttpCode } from '@nestjs/common';
import { AuthService } from '../service/Auth.service';
import { LoginDto } from '../dto/auth/Login.dto';
import { SignUpDto } from '../dto/auth/SignUp.dto';
import { UserService } from '../service/User.service';
import { User } from '../entities/User';
import { AccessTokenDto } from '../dto/auth/AccessToken.dto';

@Controller('auth')
export class AuthController {
  private authService: AuthService;
  private userService: UserService;

  constructor(userService: UserService, authService: AuthService) {
    this.authService = authService;
    this.userService = userService;
  }

  @Post('login')
  @HttpCode(200)
  async login(@Body() loginRequest: LoginDto): Promise<AccessTokenDto> {
    return this.authService.login(loginRequest);
  }

  @Post('signup')
  @HttpCode(200)
  async signUp(@Body() signUpRequest: SignUpDto): Promise<User> {
    return this.userService.signUp(signUpRequest);
  }

  @Patch('block/:id')
  async block(@Param('id') id: number) {
    await this.userService.block(id);
  }

  @Patch('unblock/:id')
  async unblock(@Param('id') id: number) {
    await this.userService.unblock(id);
  }
}
