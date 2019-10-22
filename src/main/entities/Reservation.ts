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
  @ManyToOne(() => Room, {
    eager: true,
  })
  room!: Room;
  @Column('datetime')
  from!: Date;
  @Column('datetime')
  until!: Date;
  @ManyToOne(() => MealPlan, {
    eager: true,
  })
  @JoinColumn()
  mealPlan?: MealPlan;
  @ManyToOne(() => User, {
    eager: true,
  })
  @JoinColumn()
  user!: User;
}
