import { Amenity } from './Amenity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Room {
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
}
