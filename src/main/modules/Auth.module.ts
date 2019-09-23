import { Injectable, Module } from '@nestjs/common';
import { UserModule } from './User.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from '../service/Auth.service';
import { ConfigModule } from './Config.module';
import { ConfigService } from '../service/Config.service';
import { JwtFactory } from '../factory/Jwt.factory';
import { JwtStrategy } from '../strategy/Jwt.strategy';
import { AuthController } from '../controller/Auth.controller';

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
  providers: [AuthService, AuthController, JwtStrategy],
  exports: [AuthService, AuthController],
})
export class AuthModule {}
