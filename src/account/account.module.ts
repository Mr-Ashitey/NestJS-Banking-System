import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { Account } from './model/account.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Account]), AuthModule],
  controllers: [AccountController],
  providers: [AccountService],
})
export class AccountModule {}
