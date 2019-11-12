import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '../service/Config.service';
import { LoggedUserDto } from '../dto/user/LoggedUser.dto';

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
    return new LoggedUserDto(payload.id, payload.username, payload.roles);
  }
}
