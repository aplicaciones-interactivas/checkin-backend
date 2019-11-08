import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { SignUpDto } from '../api/request/auth/SignUp.dto';
import { User } from '../entities/User';
import { CreateUserDto } from '../api/request/user/CreateUser.dto';
import { UpdateUserDto } from '../api/request/user/UpdateUser.dto';
import { Role } from '../entities/Role';
import { NoSuchElementError } from '../error/NoSuchElement.error';
import { RoleRepository } from './Role.repository';

export class UserRepository {
  private noSuchElementByIdMessage = 'Unable to find user with id: ';
  private noSuchElementByUsernameOrEmailMessage = 'Unable to find user with param: ';

  constructor(@InjectEntityManager() private entityManager: EntityManager, private roleRepository: RoleRepository) {
  }

  async signUp(userRequest: SignUpDto): Promise<User> {
    return this.createUserWithRoles(userRequest);
  }

  async create(userRequest: CreateUserDto): Promise<User> {
    const signUpRequest = new SignUpDto();
    signUpRequest.username = userRequest.username;
    signUpRequest.password = userRequest.password;
    signUpRequest.email = userRequest.email;
    signUpRequest.name = userRequest.name;
    signUpRequest.lastname = userRequest.lastname;
    return this.createUserWithRoles(signUpRequest, userRequest.rolesNames);
  }

  async update(id: number, userRequest: UpdateUserDto): Promise<User> {
    return this.entityManager.transaction(async transactionalEntityManager => {
      const user = await transactionalEntityManager.findOne(User, id);
      if (userRequest.password) {
        user.password = userRequest.password;
      }
      if (userRequest.email) {
        user.email = userRequest.email;
      }
      if (userRequest.name) {
        user.name = userRequest.name;
      }
      if (userRequest.lastname) {
        user.lastname = userRequest.lastname;
      }
      return transactionalEntityManager.save(user);
    });
  }

  private async createUserWithRoles(userRequest: SignUpDto, roleNames?: string[]): Promise<User> {
    return this.entityManager.transaction(async transactionalEntityManager => {
      let userToSave: User = transactionalEntityManager.create(User, userRequest);
      userToSave.password = userRequest.password;
      userToSave.active = true;
      userToSave.name = userRequest.name;
      userToSave.lastname = userRequest.lastname;
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
      return userToSave;
    });
  }

  private async getRoles(roleNames?: string[]): Promise<Role[]> {
    if (roleNames) {
      return this.roleRepository.findByNames(roleNames);
    } else {
      return this.roleRepository.findByNames(['USER']);
    }
  }

  async findByUsernameOrEmail(param: string): Promise<User> {
    const user = (await this.entityManager.find(User, {
      where: [{ username: param }, { email: param }],
    }))[0];
    if (user) {
      return user;
    } else {
      throw new NoSuchElementError(
        this.noSuchElementByUsernameOrEmailMessage + param,
      );
    }
  }

  async findById(id: number): Promise<User> {
    return this.entityManager.findOne(User, id);
  }

  async block(id: number): Promise<void> {
    return this.activate(id, false);
  }

  async activate(id: number, active: boolean): Promise<void> {
    const user: User | undefined = await this.entityManager.findOne(User, id);
    if (user) {
      user.active = active;
      await this.entityManager.save(User, user);
    } else {
      throw new NoSuchElementError(this.noSuchElementByIdMessage + id);
    }
  }

  async unblock(id: number): Promise<void> {
    return this.activate(id, true);
  }
}
