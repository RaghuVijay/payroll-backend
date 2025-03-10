import {
  IsBoolean,
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Gender } from '../enums/gender.enum';

export class SignupDto {
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
  @IsOptional()
  @MaxLength(95)
  surname?: string;

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

  @IsUrl()
  @IsOptional()
  profile_pic?: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{2}-\d{2}-\d{4}$/, {
    message: 'Date of birth must be in the format DD-MM-YYYY',
  })
  dob: string; // Keep as string for validation

  @IsEnum(Gender)
  @IsNotEmpty()
  gender: Gender;

  @IsString()
  @IsNotEmpty()
  organization_code: string;

  @IsString()
  @IsNotEmpty()
  role_code: string;

  @IsBoolean()
  @IsNotEmpty()
  is_active: boolean = false;
}
