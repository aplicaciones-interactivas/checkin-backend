import { Amenity } from './Amenity';
import { MealPlan } from './MealPlan';
import {
  Column,
  Entity,
  ManyToOne,
  ManyToMany,
  PrimaryGeneratedColumn,
  JoinColumn,
  JoinTable, OneToMany, RelationId,
} from 'typeorm';
import { User } from './User';
import { Room } from './Room';
import { Reservation } from './Reservation';
import { HotelImage } from './HotelImage';
import { RoomType } from './RoomType';

@Entity()
export class Hotel {
  @PrimaryGeneratedColumn()
  id!: number;
  @Column('varchar')
  name!: string;
  @Column('varchar')
  contactEmail?: string;
  @Column('varchar')
  primaryContactPhone?: string;
  @Column({ type: 'varchar', nullable: true })
  secondaryContactPhone?: string;
  @Column('varchar')
  checkinTime?: string;
  @Column('varchar')
  checkoutTime?: string;
  @Column('integer')
  stars?: number;
  @Column('varchar')
  category?: string;
  @Column('varchar')
  country!: string;
  @Column('varchar')
  city!: string;
  @Column('text')
  address!: string;
  @ManyToMany(() => Amenity, {
    eager: true,
  })
  @JoinTable()
  amenities?: Amenity[];
  @ManyToOne(() => User)
  @JoinColumn()
  user?: Promise<User>;
  @OneToMany(() => Room, room => room.hotel)
  @JoinColumn()
  rooms: Promise<Room>;
  @Column('integer')
  userId!: number;
  @OneToMany(() => HotelImage, hotelImage => hotelImage.hotel)
  @JoinColumn()
  hotelImages: Promise<HotelImage[]>;
  @RelationId((hotel: Hotel) => hotel.hotelImages)
  hotelImagesIds: number[];
}
