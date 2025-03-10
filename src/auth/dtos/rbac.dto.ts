import { IsString, IsNotEmpty, Length, IsOptional } from 'class-validator';

export class CreateRbacDto {
  @IsString()
  @IsNotEmpty()
  @Length(10, 10)
  feature_code: string;

  @IsString()
  @IsNotEmpty()
  @Length(10, 10)
  role_code: string;

  @IsOptional()
  created_at?: Date;

  @IsOptional()
  updated_at?: Date;

  @IsOptional()
  deleted_at?: Date;
}
