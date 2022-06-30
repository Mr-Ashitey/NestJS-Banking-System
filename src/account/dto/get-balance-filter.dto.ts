import { IsOptional, IsString } from 'class-validator';

export class GetBalanceFilterDto {
  // optional properties
  @IsOptional()
  @IsString()
  account_id?: string;
}
