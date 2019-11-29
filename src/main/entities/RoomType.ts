import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Amenity } from './Amenity';
import { Hotel } from './Hotel';
import { Room } from './Room';

@Entity()
export class RoomType {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('varchar')
  type!: string;

  @Column('integer')
  maxOcupancy?: number;

  @Column('decimal')
  surfaceArea?: number;

  @Column('integer')
  guests?: number;

  @ManyToOne(() => Hotel, {
    eager: true,
  })
  @JoinColumn()
  hotel?: Hotel;

  @Column('integer')
  hotelId?: number;

  @Column('decimal')
  price?: number;

  @OneToMany(() => Room, (room) => room.roomType)
  @JoinColumn()
  rooms: Room[];
}
