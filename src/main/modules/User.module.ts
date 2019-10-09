import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/User';
import { RoleRepository } from '../repository/Role.repository';
import { RoleModule } from './Role.module';
import { UserRepository } from '../repository/User.repository';
import { UserService } from '../service/User.service';
import { UserController } from '../controller/User.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User]), RoleModule],
  exports: [TypeOrmModule],
  providers: [UserRepository, UserService, UserController],
  controllers: [UserController],
})
export class UserModule {
}
