// src/income/dto/create-income-details.dto.ts
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  Length,
} from 'class-validator';
import { IncomeType } from '../enums/income-type.enum';

export class CreateIncomeDetailsDto {
  @IsUUID()
  @IsNotEmpty()
  summary_code: string;

  @IsEnum(IncomeType, { message: 'Invalid income type' })
  @IsNotEmpty()
  type: IncomeType;

  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  name: string;

  @IsNumber()
  @IsNotEmpty()
  amount: number;
}
