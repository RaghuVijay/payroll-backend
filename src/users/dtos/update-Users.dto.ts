import {
  IsString,
  IsOptional,
  MaxLength,
  IsUrl,
  IsEnum,
  IsBoolean,
} from 'class-validator';
import { Gender } from '../enums/gender.enum';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  @MaxLength(95)
  name?: string;

  @IsString()
  @IsOptional()
  @MaxLength(95)
  surname?: string;

  @IsUrl()
  @IsOptional()
  profile_pic?: string;

  @IsString()
  @IsOptional()
  dob?: string;

  @IsEnum(Gender)
  @IsOptional()
  gender?: Gender;

  @IsString()
  @IsOptional()
  organization_code?: string;

  @IsString()
  @IsOptional()
  role_code?: string;

  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}
