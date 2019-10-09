import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Put, UseGuards } from '@nestjs/common';
import { CreateUserRequest } from '../api/request/user/CreateUser.request';
import { UserService } from '../service/User.service';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from '../auth/guards/Role.guard';
import { ItsMeGuard } from '../auth/guards/ItsMe.guard';
import { UpdateUserRequest } from '../api/request/user/UpdateUser.request';
import { User } from '../decorator/User.decorator';

@Controller('user')
export class UserController {

  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  @UseGuards(AuthGuard('jwt'), new RoleGuard(['SUPERUSER']))
  @Post()
  public create(@Body() createUserRequest: CreateUserRequest) {
    return this.userService.create(createUserRequest);
  }

  @UseGuards(AuthGuard('jwt'), new RoleGuard(['SUPERUSER']), new ItsMeGuard())
  @Put('/:id')
  public update(@Param('id') id: number, @Body() updateUserRequest: UpdateUserRequest) {
    return this.userService.update(id, updateUserRequest);
  }

  @UseGuards(AuthGuard('jwt'), new ItsMeGuard())
  @Get('/profile')
  public profile(@User() user: any) {
    return this.userService.findById(user.id);
  }
}
