import { ConfigService } from '../service/Config.service';
import { DynamicModule, Inject, Injectable } from '@nestjs/common';
import {
  TypeOrmModule,
  TypeOrmModuleOptions,
  TypeOrmOptionsFactory,
} from '@nestjs/typeorm';

@Injectable()
export class TypeOrmFactory implements TypeOrmOptionsFactory {
  private configService: ConfigService;

  constructor(configService: ConfigService) {
    this.configService = configService;
  }

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      // @ts-ignore
      type: this.configService.getEnvConfig.DB_DIALECT,
      host: this.configService.getEnvConfig.DB_HOST,
      port: this.configService.getEnvConfig.DB_PORT,
      username: this.configService.getEnvConfig.DB_USER,
      password: this.configService.getEnvConfig.DB_PASSWORD,
      database: this.configService.getEnvConfig.DB,
      entities: ['./**/entities/*{.ts,.js}'],
      synchronize: !!this.configService.getEnvConfig.DB_SYNCHRO,
    };
  }
}
