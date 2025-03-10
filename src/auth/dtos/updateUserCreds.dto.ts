import {
  IsEmail,
  IsString,
  IsNotEmpty,
  Length,
  Matches,
  IsBoolean,
  IsOptional,
} from 'class-validator';

export class UpdateUserCredsDto {
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  @Length(8, 255)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/, {
    message:
      'Password must contain at least one letter, one number, and be at least 8 characters long',
  })
  password?: string;

  @IsString()
  @IsOptional()
  @Length(10, 10)
  @Matches(/^CRED\d{4}$/, {
    message: 'Code must start with "CRED" followed by 4 digits',
  })
  code?: string;

  @IsString()
  @IsOptional()
  role_code?: string; // Foreign key to UserRoles entity

  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}