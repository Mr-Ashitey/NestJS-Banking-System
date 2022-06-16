import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Utils } from 'src/utils';
import { Repository } from 'typeorm';
import { CreateAccountDto } from './dto/create-account.dto';
import { Account } from './model/account.entity';

@Injectable()
export class AccountService {
  private logger = new Logger('AccountService');
  constructor(
    @InjectRepository(Account)
    private accountsRepository: Repository<Account>,
  ) {}

  // create account service
  async createAccount(createAccountDto: CreateAccountDto) {
    const { account_name, type, next_of_kin } = createAccountDto;

    const account = this.accountsRepository.create({
      number: Utils.generateAccountNumber(),
      account_name,
      type,
      balance: 0.0,
      next_of_kin,
      statement: '',
      is_active: false,
    });

    try {
      await this.accountsRepository.save(account);

      return account;
    } catch (error) {
      // this.logger.error(
      //   `Failed to create a task for user "${
      //     // user.username
      //   }". Data: ${JSON.stringify(createAccountDto)}`,
      //   error.stack,
      // );
      throw new ConflictException(Utils.extractErrorMessage(error));
    }
  }
}
