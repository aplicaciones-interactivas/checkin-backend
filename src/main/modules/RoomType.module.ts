import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomType } from '../entities/RoomType';
import { RoomTypeRepository } from '../repository/RoomType.repository';
import { RoomTypeService } from '../service/RoomType.service';
import { RoomTypeController } from '../controller/RoomType.controller';

@Module({
  imports: [TypeOrmModule.forFeature([RoomType])],
  exports: [TypeOrmModule, RoomTypeRepository, RoomTypeService],
  providers: [RoomTypeRepository, RoomTypeService],
  controllers: [RoomTypeController],
})
export class RoomTypeModule {

}
