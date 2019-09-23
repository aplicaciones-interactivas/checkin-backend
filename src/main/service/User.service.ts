import { Injectable } from '@nestjs/common';
import { User } from '../entities/User';
import { EntityManager, Repository, Transaction, TransactionManager } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import UserResponse from '../api/response/User.response';
import { CreateUserRequest } from '../api/request/user/CreateUser.request';
import { UpdateUserRequest } from '../api/request/user/UpdateUser.request';
import { NoSuchElementError } from '../error/NoSuchElement.error';
import { BCryptUtils } from '../utils/BCrypt.utils';
import { SignUpRequest } from '../api/request/auth/SignUp.request';

@Injectable()
export class UserService {
  private noSuchElementByIdMessage = 'Unable to find user with id: ';
  private noSuchElementByUsernameOrEmailMessage =
    'Unable to find user with param: ';
  private userRepository: Repository<User>;

  constructor(@InjectRepository(User) userRepository: Repository<User>) {
    this.userRepository = userRepository;
  }

  @Transaction()
  async create(userRequest: CreateUserRequest): Promise<UserResponse> {
    let user: User = this.userRepository.create(userRequest);
    user.password = BCryptUtils.hash(userRequest.password);
    const id = await this.userRepository
      .createQueryBuilder()
      .insert()
      .values(user)
      .execute();
    user.id = id.raw.insertId;
    await this.userRepository
      .createQueryBuilder()
      .relation(User, 'roles')
      .of(user)
      .add(userRequest.rolesId);
    await this.userRepository
      .createQueryBuilder()
      .relation(User, 'organization')
      .of(user)
      .set(userRequest.organizationId);
    user = await this.userRepository.preload(user);
    return this.toResponse(user);
  }

  private toResponse(user: User): UserResponse {
    const userResponse: UserResponse = {
      id: user.id,
      email: user.email,
      password: user.password,
      username: user.username,
      rolesId: user.roles.map(rol => {
        return { id: rol.id, roleName: rol.roleName };
      }),
    };

    if (user.organization) {
      userResponse.organizationId = user.organization.id;
    }

    return userResponse;
  }

  async update(
    id: number,
    userRequest: UpdateUserRequest,
  ): Promise<UserResponse | undefined> {
    const user: User | undefined = await this.userRepository.findOne(id);
    if (userRequest.password || userRequest.email) {
      if (user) {
        if (userRequest.email) {
          user.email = userRequest.email;
        }
        if (userRequest.password) {
          user.password = BCryptUtils.hash(userRequest.password);
        }
        return this.toResponse(await this.userRepository.save(user));
      } else {
        throw new NoSuchElementError(this.noSuchElementByIdMessage + id);
      }
    }
    return user ? this.toResponse(user) : undefined;
  }

  async findById(id: number): Promise<UserResponse> {
    const user = await this.userRepository.findOne(id);
    if (user) {
      return this.toResponse(user);
    } else {
      throw new NoSuchElementError(this.noSuchElementByIdMessage + id);
    }
  }

  async findByOrganizationId(organizationId: number): Promise<UserResponse[]> {
    const users = await this.userRepository.find({
      where: {
        organization: {
          id: organizationId,
        },
      },
    });
    return users.map(this.toResponse);
  }

  async findByUsernameOrEmail(param: string): Promise<UserResponse> {
    const user = (await this.userRepository.find({
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
    const user: User | undefined = await this.userRepository.findOne(id);
    if (user) {
      user.active = active;
      await this.userRepository.save(user);
    } else {
      throw new NoSuchElementError(this.noSuchElementByIdMessage + id);
    }
  }

  unblock(id: number): Promise<void> {
    return this.activate(id, true);
  }
}
