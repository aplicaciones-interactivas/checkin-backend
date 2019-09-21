import { Hotel } from './Hotel';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class HotelImage {
  @PrimaryGeneratedColumn()
  id!: number;
  @ManyToOne(() => Hotel)
  @JoinColumn()
  hotel!: Hotel;
  @Column('text')
  path!: string;
}
