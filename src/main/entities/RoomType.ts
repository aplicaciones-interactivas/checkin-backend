import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Amenity } from './Amenity';
import { Hotel } from './Hotel';

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

  @ManyToMany(() => Amenity)
  @JoinTable()
  amenities?: Amenity[];

  @ManyToOne(() => Hotel)
  @JoinColumn()
  hotel?: Hotel;

  @Column('integer')
  hotelId?: number;

  @Column('decimal')
  price?: number;
}
