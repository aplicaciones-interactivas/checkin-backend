import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/User';
import { Role } from '../entities/Role';
import { RoleRepository } from '../repository/Role.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Role])],
  exports: [TypeOrmModule, RoleRepository],
  providers: [RoleRepository],
})
export class RoleModule {
}
