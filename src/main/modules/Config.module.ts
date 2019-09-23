import { Module } from '@nestjs/common';
import { ConfigService } from '../service/Config.service';

@Module({
  providers: [
    {
      provide: ConfigService,
      useValue: new ConfigService(
        `./src/resources/conf/${process.env.NODE_ENV || 'development'}.env`,
      ),
    },
  ],
  exports: [ConfigService],
})
export class ConfigModule {}
