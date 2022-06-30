import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { AccountService } from './account.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { DepositWithdrawAccountDto } from './dto/deposit-withdraw-account.dto';
import { Account } from './model/account.entity';

@Controller('account')
@UseGuards(AuthGuard())
export class AccountController {
  private logger = new Logger('AccountController');
  constructor(private accountService: AccountService) {}

  @Get()
  async getAllUserAccounts(@GetUser() user: User): Promise<object> {
    this.logger.verbose(`User "${user.userName}" is getting all accounts`);
    return this.accountService.getAllUserAccounts(user);
  }

  @Post('create-account')
  async createAccount(
    @Body() createAccountDto: CreateAccountDto,
    @GetUser() user: User,
  ): Promise<object> {
    this.logger.verbose(
      `User "${user.userName}" creating a new task. Data: ${JSON.stringify(
        createAccountDto,
      )}`,
    );
    return this.accountService.createAccount(createAccountDto, user);
  }

  @Get('/:id')
  getAccountById(
    @Param('id') id: string,
    @GetUser() user: User,
  ): Promise<Account> {
    this.logger.verbose(`User "${user.userName}" retrieving task "${id}".`);
    return this.accountService.getAccountById(id, user);
  }

  @Post('/:id/deposit-account')
  async depositAccount(
    @Param('id') id: string,
    @Body() depositAccountDto: DepositWithdrawAccountDto,
    @GetUser() user: User,
  ): Promise<object> {
    this.logger.verbose(
      `User "${
        user.userName
      }" is depositing into account. Data: ${JSON.stringify(
        depositAccountDto,
      )}`,
    );

    const { amount } = depositAccountDto;
    return this.accountService.depositAccount(id, amount, user);
  }

  @Post('/:id/withdraw-account')
  async cashWithdrawal(
    @Param('id') id: string,
    @Body() withdrawAccountDto: DepositWithdrawAccountDto,
    @GetUser() user: User,
  ) {
    this.logger.verbose(
      `User "${
        user.userName
      }" is withdrawing money from account. Data: ${JSON.stringify(
        withdrawAccountDto,
      )}`,
    );

    const { amount } = withdrawAccountDto;
    return this.accountService.cashWithdrawal(id, amount, user);
  }
}
