import { Account } from 'src/account/model/account.entity';
import {
  Column,
  Entity,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity()
@Unique(['username', 'email'])
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @PrimaryColumn({ name: 'USERNAME' })
  username: string;

  @PrimaryColumn({ name: 'EMAIL' })
  email: string;

  @Column({})
  password: string;

  @Column({})
  phone_no: string;

  @Column({ type: 'date' })
  date_of_birth: string;

  @OneToMany(() => Account, (account) => account.user, { eager: false })
  accounts: Account[];
}
