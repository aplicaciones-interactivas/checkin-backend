import { Role } from './Role';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn, RelationId,
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

  @ManyToMany(type => Role, {
    eager: true,
  })
  @JoinTable()
  roles!: Role[];

  @Column('boolean', {
    default: false,
  })
  active!: boolean;

  public hasRole(roleName: string): boolean {
    return this.roles.map(role => role.roleName).includes(roleName);
  }
}
