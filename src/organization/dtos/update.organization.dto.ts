import { IsString, IsOptional, Length, Matches } from 'class-validator';

export class UpdateOrganizationDto {
  @IsOptional()
  @IsString()
  @Length(10, 10)
  @Matches(/^ORG\d{4}$/, {
    message: 'Code must start with "ORG" followed by 4 digits',
  })
  code?: string;

  @IsOptional()
  @IsString()
  @Length(1, 255)
  name?: string;

  @IsOptional()
  @IsString()
  @Length(1, 255)
  address_1?: string;

  @IsOptional()
  @IsString()
  @Length(1, 255)
  address_2?: string;

  @IsOptional()
  @IsString()
  @Length(1, 20)
  city?: string;

  @IsOptional()
  @IsString()
  @Length(1, 20)
  country?: string;
}
