import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/user.entity';
import { Utils } from 'src/utils';
import { Repository } from 'typeorm';
import { CreateAccountDto } from './dto/create-account.dto';
import { Account } from './model/account.entity';

@Injectable()
export class AccountService {
  private logger = new Logger('AccountService', { timestamp: true });
  constructor(
    @InjectRepository(Account)
    private accountsRepository: Repository<Account>,
  ) {}

  // find a user's account
  async getAccountById(id: string, user: User): Promise<Account> {
    const account = await this.accountsRepository.findOne({
      // relations: {
      //   user: true,
      // },
      where: {
        id,
        user: {
          id: user.id,
        },
      },
    });

    if (!account) {
      this.logger.error(`Account with id "${id}" not found.`);
      throw new ConflictException('Account not found');
    }

    return account;
  }

  // get all accounts service
  async getAllUserAccounts(user: User): Promise<Account[]> {
    try {
      const accounts = await this.accountsRepository.find({
        where: {
          user: {
            id: user.id,
          },
        },
      });

      return accounts;
    } catch (error) {
      this.logger.error(
        `Failed to get all accounts for user "${
          user.userName
        }". Data: ${JSON.stringify(user)}`,
        error.stack,
      );
      throw new ConflictException(Utils.extractErrorMessage(error));
    }
  }

  // create account service
  async createAccount(
    createAccountDto: CreateAccountDto,
    user: User,
  ): Promise<object> {
    const { account_name, type, next_of_kin } = createAccountDto;

    const account = this.accountsRepository.create({
      number: Utils.generateAccountNumber(),
      account_name,
      type,
      balance: 0.0,
      next_of_kin,
      statement: '',
      is_active: false,
      user,
    });

    try {
      await this.accountsRepository.save(account);

      return { account, success: 'Account created successfully' };
    } catch (error) {
      this.logger.error(
        `Failed to create a task for user "${
          user.userName
        }". Data: ${JSON.stringify(createAccountDto)}`,
        error.stack,
      );
      throw new ConflictException(Utils.extractErrorMessage(error));
    }
  }

  // deposit account service
  async depositAccount(
    id: string,
    amount: number,
    user: User,
  ): Promise<object> {
    const account = await this.getAccountById(id, user);

    account.balance += Number(amount);
    account.statement += `${amount} deposited into account.\n`;
    await this.accountsRepository.save(account);

    return {
      id: account.id,
      amount: account.balance,
      success: 'Account deposited successfully',
    };

    console.log(account);
    // account[0].balance = account[0].balance + amount;
  }
}
