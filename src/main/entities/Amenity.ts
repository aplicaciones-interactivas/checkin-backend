import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Amenity {
  @PrimaryGeneratedColumn()
  id!: number;
  @Column('varchar')
  code!: string;
  @Column('text')
  description!: string;
}
