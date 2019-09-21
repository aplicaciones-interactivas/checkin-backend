import { ConfigService } from '../service/config.service';
import { DynamicModule, Inject, Injectable } from '@nestjs/common';
import {
  TypeOrmModule,
  TypeOrmModuleOptions,
  TypeOrmOptionsFactory,
} from '@nestjs/typeorm';

@Injectable()
export class TypeormFactory implements TypeOrmOptionsFactory {
  private configService: ConfigService;

  constructor(configService: ConfigService) {
    this.configService = configService;
  }

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      // @ts-ignore
      type: this.configService.get('DB_DIALECT'),
      host: this.configService.get('DB_HOST'),
      port: this.configService.get('DB_PORT'),
      username: this.configService.get('DB_USERNAME'),
      password: this.configService.get('DB_PASSWORD'),
      database: this.configService.get('DB'),
      entities: [__dirname + '/**/entities/*{.ts,.js}'],
      synchronize: !!this.configService.get('DB_SYNCHRO'),
    };
  }
}
