import { Module } from '@nestjs/common';
import { PlacesProxyController } from '../controller/PlacesProxy.controller';

@Module({
  controllers: [PlacesProxyController],
})
export class PlacesModule {
}
