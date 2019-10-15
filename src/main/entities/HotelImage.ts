import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn, RelationId } from 'typeorm';
import { Amenity } from './Amenity';
import { Hotel } from './Hotel';

@Entity()
export class HotelImage {
  @PrimaryGeneratedColumn()
  id!: number;
  @Column('text')
  path!: string;
  @ManyToOne(() => Hotel)
  @JoinTable()
  hotel?: Promise<Hotel>;
  @Column('integer')
  hotelId!: number;
}
