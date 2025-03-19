// src/payroll/dto/create-payroll-summary.dto.ts
import { IsDateString, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreatePayrollSummaryDto {
  @IsString()
  @IsNotEmpty()
  user_code: string;

  @IsDateString()
  @IsNotEmpty()
  pay_period: Date;

  @IsInt()
  @IsNotEmpty()
  paid_days: number;

  @IsInt()
  @IsNotEmpty()
  loss_of_pay_days: number;

  @IsDateString()
  @IsNotEmpty()
  pay_date: Date;
}
