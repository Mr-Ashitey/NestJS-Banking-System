import {
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/user.entity';
import { Utils } from 'src/utils/utils';
import { Repository } from 'typeorm';
import { CreateAccountDto } from './dto/create-account.dto';
import { GetBalanceFilterDto } from './dto/get-balance-filter.dto';
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
  async getAllUserAccounts(user: User): Promise<object> {
    try {
      const accounts = await this.accountsRepository.find({
        where: {
          user: {
            id: user.id,
          },
        },
      });

      if (accounts.length == 0) {
        return { message: 'No account created' };
      }
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
    amountToDeposit: number,
    user: User,
  ): Promise<object> {
    const account = await this.getAccountById(id, user);

    account.balance += Number(amountToDeposit);
    account.statement += `${amountToDeposit} deposited into account.\n`;
    await this.accountsRepository.save(account);

    return {
      id: account.id,
      amount: account.balance,
      success: 'Account deposited successfully',
    };
  }

  // cash withdrawal service
  async cashWithdrawal(id: string, amountToWithdraw: number, user: User) {
    const account = await this.getAccountById(id, user);

    if (account.balance < amountToWithdraw) {
      throw new ForbiddenException(
        'You do not have sufficient balance to perform this transaction',
      );
    }

    account.balance -= Number(amountToWithdraw);
    account.statement += `${amountToWithdraw} withdrawn from account.\n`;
    await this.accountsRepository.save(account);

    return {
      id: account.id,
      amount: account.balance,
      success: 'Cash withdrawal successfully',
    };
  }

  // balance enquiry
  async balanceEnquiry(filterDto: GetBalanceFilterDto, user: User) {
    const { account_id } = filterDto;
    console.log(account_id);
    const query = this.accountsRepository.createQueryBuilder('account');

    query.where({ user });

    try {
      if (filterDto.account_id) {
        query.andWhere('id = :account_id', { account_id });
        const account = await query.getOne();

        return {
          id: account.id,
          balance: account.balance,
        };
      }

      const accounts = await query.getMany();

      const output = {};
      accounts.forEach((account) => {
        output[`${account.account_name}`] = account.balance;
      });

      return { account_balances: output };
    } catch (error) {
      this.logger.error(
        `Failed to account balance for user "${
          user.email
        }". Filters: ${JSON.stringify(filterDto)}`,
        error.stack,
      );

      throw new InternalServerErrorException('Error getting account balance.');
    }
  }
}
