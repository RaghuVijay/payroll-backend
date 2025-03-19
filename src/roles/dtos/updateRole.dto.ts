import { IsOptional, IsString, IsEnum, IsBoolean } from 'class-validator';
import { Status } from '../enums/statusType.enum';

export class UpdateRoleDto {
  @IsOptional()
  @IsString()
  role_name?: string;

  @IsOptional()
  @IsEnum(Status)
  status?: Status;

  @IsOptional()
  @IsBoolean()
  is_default?: boolean;
}
