import {
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Gender } from '../enums/gender.enum'; // Import Gender enum

export class SignupDto {
  @IsUUID()
  id: string;

  @IsString()
  @Matches(/^USR\d+$/, {
    message: 'ID must start with "USR" followed by digits',
  })
  code: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(95)
  name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(95)
  surname: string; // Added surname field

  @IsEmail()
  @IsNotEmpty()
  @MaxLength(96)
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(96)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, {
    message:
      'Password must be at least 8 characters long, contain at least one letter, one number, and one special character',
  })
  password: string;

  @IsString()
  @IsNotEmpty()
  dob: string;

  @IsEnum(Gender)
  @IsNotEmpty()
  gender: Gender;

  @IsString()
  @IsNotEmpty()
  organization_code: string; // Replaced mall_code with organization_code

  @IsNotEmpty()
  @IsDate()
  created_at: Date;

  @IsNotEmpty()
  @IsDate()
  updated_at: Date;

  @IsNotEmpty()
  @IsDate()
  deleted_at: Date;
}
