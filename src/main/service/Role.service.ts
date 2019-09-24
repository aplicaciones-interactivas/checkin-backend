import { Injectable } from '@nestjs/common';
import { Connection, In } from 'typeorm';
import { InjectConnection } from '@nestjs/typeorm';
import { Role } from '../entities/Role';
import RoleResponse from '../api/response/Role.response';

@Injectable()
export class RoleService {

  private connection: Connection;

  constructor(@InjectConnection() connection: Connection) {
    this.connection = connection;
  }

  async findByNames(names: string[]): Promise<RoleResponse[]> {
    const roles: Role[] = await this.connection.getRepository(Role).find({
      where: { roleName: In(names) },
    });
    return roles.map(this.toResponse);
  }

  private toResponse(role: Role): RoleResponse {
    const roleResponse: RoleResponse = new RoleResponse();
    roleResponse.id = role.id;
    roleResponse.roleName = role.roleName;
    return roleResponse;
  }

}
