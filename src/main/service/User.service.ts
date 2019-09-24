import { Injectable } from '@nestjs/common';
import { User } from '../entities/User';
import { getConnection } from 'typeorm';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import UserResponse from '../api/response/User.response';
import { CreateUserRequest } from '../api/request/user/CreateUser.request';

import { NoSuchElementError } from '../error/NoSuchElement.error';
import { BCryptUtils } from '../utils/BCrypt.utils';
import { RoleService } from './Role.service';
import { Role } from '../entities/Role';
import { SignUpRequest } from '../api/request/auth/SignUp.request';

@Injectable()
export class UserService {
  private noSuchElementByIdMessage = 'Unable to find user with id: ';
  private noSuchElementByUsernameOrEmailMessage =
    'Unable to find user with param: ';
  private roleService: RoleService;

  constructor(@InjectConnection() private connection, roleService: RoleService) {
    this.roleService = roleService;
  }

  async signUp(userRequest: SignUpRequest): Promise<UserResponse> {
    return this.createUserWithRoles(userRequest);
  }

  async createUser(userRequest: CreateUserRequest): Promise<UserResponse> {
    const signUpRequest = new SignUpRequest();
    signUpRequest.username = userRequest.username;
    signUpRequest.password = userRequest.password;
    signUpRequest.email = userRequest.email;
    return this.createUserWithRoles(signUpRequest, userRequest.rolesNames);
  }

  private async createUserWithRoles(userRequest: SignUpRequest, roleNames?: string[]): Promise<UserResponse> {
    return await getConnection().transaction(async transactionalEntityManager => {
      let userToSave: User = transactionalEntityManager.create(User, userRequest);
      userToSave.password = BCryptUtils.hash(userRequest.password);
      userToSave.id = (await transactionalEntityManager
        .createQueryBuilder(User, 'user')
        .insert()
        .values(userToSave)
        .execute()).raw.insertId;
      const roles = await this.getRoles(roleNames);
      await transactionalEntityManager
        .createQueryBuilder()
        .relation(User, 'roles')
        .of(userToSave)
        .add(roles);
      userToSave = await transactionalEntityManager.findOne(User, userToSave.id);
      return this.toResponse(userToSave);
    });
  }

  private async getRoles(roleNames?: string[]): Promise<Role[]> {
    if (roleNames) {
      return await this.roleService.findByNames(roleNames);
    } else {
      return await this.roleService.findByNames(['USER']);
    }
  }

  private toResponse(user: User): UserResponse {
    const userResponse: UserResponse = {
      id: user.id,
      email: user.email,
      password: user.password,
      username: user.username,
      roles: user.roles.map(rol => {
        return { id: rol.id, roleName: rol.roleName };
      }),
    };
    return userResponse;
  }

  async findByUsernameOrEmail(param: string): Promise<UserResponse> {
    const user = (await this.connection.getRepository(User).find({
      where: [{ username: param }, { email: param }],
    }))[0];
    if (user) {
      return this.toResponse(user);
    } else {
      throw new NoSuchElementError(
        this.noSuchElementByUsernameOrEmailMessage + param,
      );
    }
  }

  async block(id: number): Promise<void> {
    return this.activate(id, false);
  }

  async activate(id: number, active: boolean): Promise<void> {
    const user: User | undefined = await this.connection.findOne(User, id);
    if (user) {
      user.active = active;
      await this.connection.update(User, user);
    } else {
      throw new NoSuchElementError(this.noSuchElementByIdMessage + id);
    }
  }

  async unblock(id: number): Promise<void> {
    return this.activate(id, true);
  }
}
