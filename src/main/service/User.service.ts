import { Injectable } from '@nestjs/common';
import { User } from '../entities/User';
import { CreateUserRequest } from '../api/request/user/CreateUser.request';
import { BCryptUtils } from '../utils/BCrypt.utils';
import { SignUpRequest } from '../api/request/auth/SignUp.request';
import { UpdateUserRequest } from '../api/request/user/UpdateUser.request';
import { UserRepository } from '../repository/User.repository';
import { RoleRepository } from '../repository/Role.repository';

@Injectable()
export class UserService {

  constructor(private userRepository: UserRepository, private roleRepository: RoleRepository) {
  }

  async signUp(userRequest: SignUpRequest): Promise<User> {
    userRequest.password = BCryptUtils.hash(userRequest.password);
    return await this.userRepository.signUp(userRequest);
  }

  async create(userRequest: CreateUserRequest): Promise<User> {
    userRequest.password = BCryptUtils.hash(userRequest.password);
    return await this.userRepository.create(userRequest);
  }

  async update(id: number, userRequest: UpdateUserRequest): Promise<User> {
    if (userRequest.password) {
      userRequest.password = BCryptUtils.hash(userRequest.password);
    }
    return await this.userRepository.update(id, userRequest);
  }

  async findByUsernameOrEmail(param: string): Promise<User> {
    return await this.userRepository.findByUsernameOrEmail(param);
  }

  async findById(id: number): Promise<User> {
    return await this.userRepository.findById(id);
  }

  async block(id: number): Promise<void> {
    return await this.userRepository.block(id);
  }

  async unblock(id: number): Promise<void> {
    return this.userRepository.activate(id, true);
  }
}
