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

@Entity()
export class Reservation {
  @PrimaryGeneratedColumn()
  id!: number;
  @ManyToOne(() => Room)
  room!: Room;
  @Column('datetime')
  from!: Date;
  @Column('datetime')
  until!: Date;
  @ManyToOne(() => MealPlan)
  @JoinColumn()
  mealPlan?: MealPlan;
  @ManyToOne(() => User)
  @JoinColumn()
  user!: User;
}
