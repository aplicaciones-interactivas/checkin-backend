import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '../service/Config.service';
import { LoggedUserDto } from '../api/request/user/LoggedUser.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getEnvConfig.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    return new LoggedUserDto(payload._id, payload._username, payload._roles);
  }
}
