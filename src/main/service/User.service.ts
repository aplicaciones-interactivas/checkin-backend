import { Injectable } from '@nestjs/common';
import { User } from '../entities/User';
import { CreateUserDto } from '../dto/user/CreateUser.dto';
import { BCryptUtils } from '../utils/BCrypt.utils';
import { SignUpDto } from '../dto/auth/SignUp.dto';
import { UpdateUserDto } from '../dto/user/UpdateUser.dto';
import { UserRepository } from '../repository/User.repository';
import { RoleRepository } from '../repository/Role.repository';
import { UserDto } from '../dto/user/User.dto';

@Injectable()
export class UserService {

  constructor(private userRepository: UserRepository, private roleRepository: RoleRepository) {
  }

  async signUp(userRequest: SignUpDto): Promise<User> {
    userRequest.password = BCryptUtils.hash(userRequest.password);
    return this.userRepository.signUp(userRequest);
  }

  async create(userRequest: CreateUserDto): Promise<User> {
    userRequest.password = BCryptUtils.hash(userRequest.password);
    return this.userRepository.create(userRequest);
  }

  async update(id: number, userRequest: UpdateUserDto): Promise<User> {
    if (userRequest.password) {
      userRequest.password = BCryptUtils.hash(userRequest.password);
    }
    return this.userRepository.update(id, userRequest);
  }

  async findByUsernameOrEmail(param: string): Promise<User> {
    return this.userRepository.findByUsernameOrEmail(param);
  }

  async findById(id: number): Promise<User> {
    return this.userRepository.findById(id);
  }

  async block(id: number): Promise<void> {
    return this.userRepository.block(id);
  }

  async unblock(id: number): Promise<void> {
    return this.userRepository.activate(id, true);
  }
}
