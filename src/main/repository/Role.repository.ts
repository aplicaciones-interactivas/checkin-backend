import { Injectable } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { Role } from '../entities/Role';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class RoleRepository {

  constructor(@InjectEntityManager() private readonly entityManager) {
  }

  async findByNames(names: string[]): Promise<Role[]> {
    return await this.entityManager.find(Role, {
      where: { roleName: In(names) },
    });
  }

}
