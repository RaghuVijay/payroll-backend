import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsBoolean,
  IsOptional,
} from 'class-validator';
import { Status } from '../enums/statusType.enum';

export class CreateRoleDto {
  @IsNotEmpty()
  @IsString()
  role_name: string;

  @IsNotEmpty()
  @IsEnum(Status)
  status: Status;

  @IsOptional()
  @IsBoolean()
  is_default?: boolean;
}
