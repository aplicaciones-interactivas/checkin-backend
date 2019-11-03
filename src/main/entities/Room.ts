import { Amenity } from './Amenity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToOne, OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RoomType } from './RoomType';
import { Reservation } from './Reservation';
import { User } from './User';
import { Hotel } from './Hotel';

@Entity()
export class Room {
  @PrimaryGeneratedColumn()
  id!: number;
  @Column('integer')
  number!: number;
  @ManyToOne(() => RoomType, {
    eager: true,
  })
  @JoinTable()
  roomType!: RoomType;
  @Column('integer')
  roomTypeId!: number;
  @OneToMany(() => Reservation, reservation => reservation.room)
  reservations: Promise<Reservation[]>;

  @ManyToOne(() => Hotel)
  @JoinTable()
  hotel: Promise<Hotel>;

  hotelId: number;
}
