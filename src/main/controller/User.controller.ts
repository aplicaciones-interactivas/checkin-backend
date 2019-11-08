import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Put, UseGuards } from '@nestjs/common';
import { CreateUserDto } from '../api/request/user/CreateUser.dto';
import { UserService } from '../service/User.service';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from '../auth/guards/Role.guard';
import { ItsMeGuard } from '../auth/guards/ItsMe.guard';
import { UpdateUserDto } from '../api/request/user/UpdateUser.dto';
import { UserDecorator } from '../decorator/User.decorator';
import { LoggedUserDto } from '../api/request/user/LoggedUser.dto';
import { User } from '../entities/User';
import { UserDto } from '../api/request/user/User.dto';

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
  public async profile(@UserDecorator() loggedUserDto: LoggedUserDto): Promise<UserDto> {
    const user: User = await this.userService.findByUsernameOrEmail(loggedUserDto.username);
    const userDto: UserDto = new UserDto();
    userDto.active = user.active;
    userDto.email = user.email;
    userDto.id = user.id;
    userDto.lastname = user.lastname;
    userDto.name = user.name;
    userDto.username = user.username;
    userDto.roles = user.roles.map(role => role.roleName);
    return userDto;
  }
}
