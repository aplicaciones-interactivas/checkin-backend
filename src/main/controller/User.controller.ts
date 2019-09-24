import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import UserResponse from '../api/response/User.response';
import { CreateUserRequest } from '../api/request/user/CreateUser.request';
import { UserService } from '../service/User.service';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from '../auth/Role.guard';

@Controller('user')
export class UserController {

  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  @UseGuards(AuthGuard('jwt'), new RoleGuard(['SUPERUSER']))
  @Post()
  public create(@Body() createUserRequest: CreateUserRequest): Promise<UserResponse> {
    return this.userService.createUser(createUserRequest);
  }

}
