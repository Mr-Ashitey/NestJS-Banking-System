import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAccountDto } from './dto/create-account.dto';
import { Account } from './model/account.entity';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account)
    private accountsRepository: Repository<Account>,
  ) {}

  // create account service
  async createAccount(createAccountDto: CreateAccountDto) {
    const { account_name, type, next_of_kin } = createAccountDto;

    // const number = Math.random().toString(10).substring(2, 30); //17 numbers
    const number = Math.floor(
      10000000000000000 + Math.random() * 90000000000000000,
    ); //17 numbers
    // console.log(number);

    const task = this.accountsRepository.create({
      number,
      account_name,
      type,
      balance: 0,
      next_of_kin,
      statement: '',
      is_active: false,
    });
  }
}
