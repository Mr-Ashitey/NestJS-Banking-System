import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column({})
  password: string;

  @Column({})
  phone_no: string;

  @Column({ type: 'date' })
  date_of_birth: string;

  @Column({})
  is_active: boolean;

  // @OneToMany
}
