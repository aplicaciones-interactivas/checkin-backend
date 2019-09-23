import { Injectable } from '@nestjs/common';
import { ConfigService } from '../service/Config.service';
import { JwtModuleOptions, JwtOptionsFactory } from '@nestjs/jwt';

@Injectable()
export class JwtFactory implements JwtOptionsFactory {
  configService: ConfigService;

  constructor(configService: ConfigService) {
    this.configService = configService;
  }

  createJwtOptions(): Promise<JwtModuleOptions> | JwtModuleOptions {
    return {
      secret: this.configService.getEnvConfig.JWT_SECRET,
      signOptions: {
        expiresIn: '7d',
      },
    };
  }
}
