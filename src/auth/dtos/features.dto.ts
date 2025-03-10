import { IsString, IsNotEmpty, Length, IsOptional } from 'class-validator';

export class CreateFeaturesDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  name: string;

  @IsOptional()
  created_at?: Date;

  @IsOptional()
  updated_at?: Date;

  @IsOptional()
  deleted_at?: Date;
}
