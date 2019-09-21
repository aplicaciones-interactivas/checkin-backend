import { Hotel } from './Hotel';
import { User } from './User';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Organization {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('text')
  billingAddress!: string;

  @Column('varchar')
  country!: string;

  @Column('varchar')
  billingIdentifier!: string;

  @Column('varchar')
  name!: string;

  @OneToMany(() => Hotel, hotel => hotel.organization)
  @JoinColumn()
  hotels?: Hotel[];

  @OneToMany(() => User, user => user.organization)
  @JoinColumn()
  users!: User[];
}
