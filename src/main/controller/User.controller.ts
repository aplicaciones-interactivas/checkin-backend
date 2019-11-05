import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Put, UseGuards } from '@nestjs/common';
import { CreateUserDto } from '../api/request/user/CreateUser.dto';
import { UserService } from '../service/User.service';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from '../auth/guards/Role.guard';
import { ItsMeGuard } from '../auth/guards/ItsMe.guard';
import { UpdateUserDto } from '../api/request/user/UpdateUser.dto';
import { UserDecorator } from '../decorator/User.decorator';
import { LoggedUserDto } from '../api/request/user/LoggedUser.dto';

@Controller('user')
export class UserController {

  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  @UseGuards(AuthGuard('jwt'), new RoleGuard(['SUPERUSER']))
  @Post()
  public create(@Body() createUserRequest: CreateUserDto) {
    return this.userService.create(createUserRequest);
  }

  @UseGuards(AuthGuard('jwt'), new RoleGuard(['SUPERUSER']), new ItsMeGuard())
  @Put('/:id')
  public update(@Param('id') id: number, @Body() updateUserRequest: UpdateUserDto) {
    return this.userService.update(id, updateUserRequest);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/profile')
  public profile(@UserDecorator() user: LoggedUserDto): LoggedUserDto {
    return user;
  }
}
