import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager, ObjectType } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { User } from '../entities/User';
import { LoggedUserDto } from '../dto/user/LoggedUser.dto';

export class PermissionUtils {

  public static async isOwner(entityManager: EntityManager, user: LoggedUserDto, TypeClass: { new() }, entityId: number): Promise<boolean> {
    const entity = await entityManager.findOne(TypeClass, { where: { id: entityId } });
    return user.id === entity.userId || user.roles.includes('SUPERUSER');
  }

  public static hasRole(user: LoggedUserDto, role: string): boolean {
    return user.roles.includes(role);
  }

}
