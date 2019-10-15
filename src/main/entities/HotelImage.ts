import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn, RelationId } from 'typeorm';
import { Amenity } from './Amenity';
import { Hotel } from './Hotel';

@Entity()
export class HotelImage {
  @PrimaryGeneratedColumn()
  id!: number;
  @Column('varchar')
  format!: string;
  @Column('text')
  path!: string;
  @ManyToMany(() => Hotel)
  @JoinTable()
  hotel?: Hotel;
  @Column('integer')
  hotelId!: number;
}
