import {
  IsString,
  IsNotEmpty,
  Length,
  IsOptional,
  Matches,
} from 'class-validator';

export class CreateOrganizationDto {
  @IsString()
  @IsNotEmpty()
  @Length(10, 10)
  @Matches(/^ORG\d{4}$/, {
    message: 'Code must start with "ORG" followed by 4 digits',
  })
  code: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  name: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  address_1: string;

  @IsString()
  @IsOptional()
  @Length(1, 255)
  address_2?: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 20)
  city: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 20)
  country: string;
}
