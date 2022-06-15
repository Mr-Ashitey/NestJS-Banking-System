import { User } from 'src/auth/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { AccountType } from './account-type.enum';

@Entity()
export class Account {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  number: number;

  @Column()
  account_name: string;

  @Column({})
  type: AccountType;

  @Column({})
  amount: number;

  @Column()
  next_of_kin: string;

  @Column()
  statement: string;

  @ManyToOne(() => User, (user) => user.accounts, { eager: false })
  user: User;
}
