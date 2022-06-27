import { Account } from 'src/account/model/account.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  userName: string;

  @Column({ unique: true })
  email: string;

  @Column({})
  password: string;

  @Column({})
  phone_no: string;

  @Column({ type: 'date' })
  date_of_birth: Date;

  @CreateDateColumn({ type: 'timestamp' })
  date_created: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  date_updated: Date;

  @OneToMany(() => Account, (account) => account.user, { eager: false })
  accounts: Account[];

  @Column()
  verificationToken: string;
}
