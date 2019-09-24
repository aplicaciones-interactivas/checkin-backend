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
  JoinTable,
} from 'typeorm';
import { HotelImage } from './HotelImage';
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
  @Column('varchar')
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
  @ManyToMany(() => Room)
  @JoinTable()
  rooms?: Room[];
  @ManyToMany(() => MealPlan)
  @JoinTable()
  mealPlans?: MealPlan[];
  @ManyToMany(() => HotelImage)
  @JoinTable()
  images?: HotelImage[];
  @ManyToOne(() => User)
  @JoinColumn()
  user?: User;
}
