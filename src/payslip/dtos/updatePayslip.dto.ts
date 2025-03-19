// src/payroll/dto/update-payroll-summary.dto.ts
import { IsDateString, IsInt, IsOptional, IsString } from 'class-validator';

export class UpdatePayrollSummaryDto {
  @IsString()
  @IsOptional()
  user_code?: string;

  @IsDateString()
  @IsOptional()
  pay_period?: Date;

  @IsInt()
  @IsOptional()
  paid_days?: number;

  @IsInt()
  @IsOptional()
  loss_of_pay_days?: number;

  @IsDateString()
  @IsOptional()
  pay_date?: Date;
}
