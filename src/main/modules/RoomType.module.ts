import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomType } from '../entities/RoomType';
import { RoomTypeRepository } from '../repository/RoomType.repository';
import { RoomTypeService } from '../service/RoomType.service';

@Module({
  imports: [TypeOrmModule.forFeature([RoomType])],
  exports: [TypeOrmModule, RoomTypeRepository, RoomTypeService],
  providers: [RoomTypeRepository, RoomTypeService],
})
export class RoomTypeModule {

}
