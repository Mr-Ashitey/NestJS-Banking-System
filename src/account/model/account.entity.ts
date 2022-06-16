import { User } from 'src/auth/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { AccountType } from './account-type.enum';

@Entity()
export class Account {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, type: 'bigint' })
  number: number;

  @Column({ unique: true })
  account_name: string;

  @Column({})
  type: AccountType;

  @Column({})
  balance: number;

  @Column()
  next_of_kin: string;

  @Column()
  statement: string;

  @Column()
  is_active: boolean;

  //   @Column()
  //   verification: string;

  @ManyToOne(() => User, (user) => user.accounts, { eager: false })
  user: User;
}
