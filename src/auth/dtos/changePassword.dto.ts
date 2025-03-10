import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty()
  newPassword: string;

  @IsNotEmpty()
  @IsString()
  currentPassword: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;
}
