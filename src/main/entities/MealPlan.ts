import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class MealPlan {
  @PrimaryGeneratedColumn()
  id!: number;
  @Column('varchar')
  name!: string;
  @Column('varchar')
  description!: string;
  @Column('varchar')
  code!: string;
}
