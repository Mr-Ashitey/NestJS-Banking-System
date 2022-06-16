import { Body, Controller, Logger, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { AccountService } from './account.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { Account } from './model/account.entity';

@Controller('account')
@UseGuards(AuthGuard())
export class AccountController {
  private logger = new Logger('AccountController');
  constructor(private accountService: AccountService) {}

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
}
