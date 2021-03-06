import { Injectable, Module } from '@nestjs/common';
import { UserModule } from './User.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from '../service/Auth.service';
import { ConfigModule } from './Config.module';
import { ConfigService } from '../service/Config.service';
import { JwtFactory } from '../factory/Jwt.factory';
import { JwtStrategy } from '../auth/Jwt.strategy';
import { AuthController } from '../controller/Auth.controller';
import { UserService } from '../service/User.service';
import { UserRepository } from '../repository/User.repository';
import { RoleRepository } from '../repository/Role.repository';

@Module({
  imports: [
    UserModule,
    PassportModule,
    ConfigModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      imports: [ConfigModule],
      useClass: JwtFactory,
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthController, JwtStrategy, UserService, UserRepository, RoleRepository],
  exports: [AuthService, AuthController],
})
export class AuthModule {}
