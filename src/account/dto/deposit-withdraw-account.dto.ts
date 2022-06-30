import { IsNotEmpty } from 'class-validator';

export class DepositWithdrawAccountDto {
  @IsNotEmpty()
  amount: number;
}
