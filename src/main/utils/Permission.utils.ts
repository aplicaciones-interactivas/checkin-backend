import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager, ObjectType } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { User } from '../entities/User';

export class PermissionUtils {

  public static async isOwner(entityManager: EntityManager, user: User, TypeClass: { new() }, entityId: number): Promise<boolean> {
    const entity = await entityManager.findOne(TypeClass, { where: { id: entityId } });
    return user.id === entity.userId || user.roles.filter(role => role.roleName === 'SUPERUSER').length === 1 ;
  }
}
