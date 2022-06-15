import { IsNotEmpty, IsString, IsEnum, IsNumber, Min } from 'class-validator';
import { AccountType } from '../model/account-type.enum';

export class CreateAccountDto {
  @IsNotEmpty()
  @IsString()
  account_name: string;

  @IsNotEmpty()
  @IsString()
  @IsEnum(AccountType)
  type: AccountType;

  @IsNotEmpty()
  @IsString()
  next_of_kin: string;
}
