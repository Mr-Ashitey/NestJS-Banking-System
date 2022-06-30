import { IsNotEmpty } from 'class-validator';

export class DepositAccountDto {
  @IsNotEmpty()
  amount: number;
}
