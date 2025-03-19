import { IsOptional, IsEnum } from 'class-validator';
import { IncomeType } from '../enums/income-type.enum'; // Import correct enum

export class UpdateIncomeDetailsDto {
  @IsOptional()
  summary_code?: string;

  @IsOptional()
  @IsEnum(IncomeType, { message: 'Invalid income type' }) // Validate enum
  type?: IncomeType;

  @IsOptional()
  name?: string;

  @IsOptional()
  amount?: number;
}
