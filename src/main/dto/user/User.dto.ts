import { Column, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Role } from '../../entities/Role';

export class UserDto {
  id!: number;
  username!: string;
  name: string;
  lastname: string;
  email!: string;
  roles!: string[];
  active!: boolean;
}
