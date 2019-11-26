import { Room } from './Room';
import { MealPlan } from './MealPlan';
import { User } from './User';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { HotelMealPlan } from './HotelMealPlan';

@Entity()
export class Reservation {
  @PrimaryGeneratedColumn()
  id!: number;
  @ManyToOne(() => Room, {
    eager: true,
  })
  room!: Room;
  @Column('datetime')
  from!: Date;
  @Column('datetime')
  until!: Date;
  @ManyToOne(() => HotelMealPlan, {
    eager: true,
  })
  @JoinColumn()
  hotelMealPlan?: HotelMealPlan;
  @ManyToOne(() => User, {
    eager: true,
  })
  @JoinColumn()
  user!: User;

  @Column('number', {
    nullable: true,
  })
  hotelMealPlanId: number;
  @Column('decimal')
  totalPrice: number;
}
