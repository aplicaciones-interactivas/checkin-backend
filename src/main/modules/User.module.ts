import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/User';
import { UserService } from '../service/User.service';
import { RoleService } from '../service/Role.service';
import { Role } from '../entities/Role';
import { UserController } from '../controller/User.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role])],
  exports: [TypeOrmModule, UserService, RoleService, UserController],
  providers: [UserService, RoleService, UserController],
  controllers: [UserController],
})
export class UserModule {}
