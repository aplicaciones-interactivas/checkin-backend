import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Bed {
  @PrimaryGeneratedColumn()
  id!: number;
  @Column('varchar')
  name!: string;
  @Column('varchar')
  code!: string;
}
