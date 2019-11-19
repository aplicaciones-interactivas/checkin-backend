import { Hotel } from './Hotel';
import { MealPlan } from './MealPlan';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, RelationId, Unique } from 'typeorm';

@Entity()
@Unique('hotel_mealplan_uq', ['hotelId', 'mealPlanId'])
export class HotelMealPlan {
  @PrimaryGeneratedColumn()
  id: number;
  @ManyToOne(() => Hotel)
  @JoinColumn()
  hotel: Hotel;
  @ManyToOne(() => MealPlan, { eager: true })
  @JoinColumn()
  mealPlan: MealPlan;
  @Column('decimal', { precision: 10, scale: 2 })
  additionalPrice: number;
  @Column('integer')
  hotelId: number;
  @Column('integer')
  mealPlanId: number;
}
