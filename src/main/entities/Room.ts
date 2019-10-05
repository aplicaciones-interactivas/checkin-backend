import { Amenity } from './Amenity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RoomType } from './RoomType';

@Entity()
export class Room {
  @PrimaryGeneratedColumn()
  id!: number;
  @Column('integer')
  number!: number;
/*  @ManyToOne(() => RoomType)
  @JoinTable()
  type!: RoomType;*/
  @Column('integer')
  roomTypeId!: number;
}
