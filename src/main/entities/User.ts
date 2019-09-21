import { Role } from './Role';
import { Organization } from './Organization';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('varchar', {
    unique: true,
    length: 20,
  })
  username!: string;

  @Column('varchar')
  password!: string;

  @Column('varchar')
  email!: string;

  @ManyToOne(() => Organization, {
    eager: true,
  })
  @JoinColumn()
  organization!: Organization;

  @ManyToMany(type => Role, {
    eager: true,
  })
  @JoinTable()
  roles!: Role[];

  @Column('boolean', {
    default: false,
  })
  active!: boolean;
}
