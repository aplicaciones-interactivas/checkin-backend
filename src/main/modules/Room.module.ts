import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from '../entities/Room';
import { RoomService } from '../service/Room.service';
import { RoomController } from '../controller/Room.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Room])],
  exports: [TypeOrmModule],
  providers: [RoomService, RoomController],
  controllers: [RoomController],
})
export class RoomModule {
}
