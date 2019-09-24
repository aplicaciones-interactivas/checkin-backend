import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/User';
import { UserService } from '../service/User.service';
import { RoleService } from '../service/Role.service';
import { Role } from '../entities/Role';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role])],
  exports: [TypeOrmModule, UserService, RoleService],
  providers: [UserService, RoleService],
})
export class UserModule {}
