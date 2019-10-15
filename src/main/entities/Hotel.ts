import { Amenity } from './Amenity';
import { Room } from './Room';
import { MealPlan } from './MealPlan';
import {
  Column,
  Entity,
  ManyToOne,
  ManyToMany,
  PrimaryGeneratedColumn,
  JoinColumn,
  JoinTable, OneToMany,
} from 'typeorm';
import { User } from './User';

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
  @ManyToMany(() => Amenity)
  @JoinTable()
  amenities?: Amenity[];
  @ManyToMany(() => MealPlan)
  @JoinTable()
  mealPlans?: MealPlan[];
  @ManyToOne(() => User)
  @JoinColumn()
  user?: User;
  @Column('integer')
  userId!: number;
}
