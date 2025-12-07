import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  login: string;

  @Column({ type: 'varchar', length: 255 })
  @Exclude()
  password: string;

  @Column({ type: 'int', default: 1 })
  version: number;

  @CreateDateColumn({
    type: 'bigint',
    transformer: {
      to: (value: Date) => value.getTime(),
      from: (value: number) => new Date(value),
    },
  })
  createdAt: number;

  @UpdateDateColumn({
    type: 'bigint',
    transformer: {
      to: (value: Date) => value.getTime(),
      from: (value: number) => new Date(value),
    },
  })
  updatedAt: number;
}
