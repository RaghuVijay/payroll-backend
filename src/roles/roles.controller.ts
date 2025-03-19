import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { RoleService } from './providers/role.service';
import { CreateRoleDto } from './dtos/creatRole.dto';
import { UpdateRoleDto } from './dtos/updateRole.dto';
import { UserRoles } from './roles.entity';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { AuthType } from 'src/auth/enums/auth-type.enum';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Auth(AuthType.Bearer)
  @Roles('SUPERUSER', 'ADMIN')
  @Post()
  async create(@Body() createRoleDto: CreateRoleDto): Promise<UserRoles> {
    try {
      return await this.roleService.create(createRoleDto);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to create role');
    }
  }

  @Auth(AuthType.Bearer)
  @Roles('SUPERUSER', 'ADMIN')
  @Get()
  async findAll(): Promise<UserRoles[]> {
    try {
      return await this.roleService.findAll();
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch roles');
    }
  }

  @Auth(AuthType.Bearer)
  @Roles('SUPERUSER', 'ADMIN')
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<UserRoles> {
    try {
      return await this.roleService.findOne(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to fetch role');
    }
  }

  @Auth(AuthType.Bearer)
  @Roles('SUPERUSER', 'ADMIN')
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateRoleDto,
  ): Promise<UserRoles> {
    try {
      return await this.roleService.update(id, updateRoleDto);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update role');
    }
  }

  @Auth(AuthType.Bearer)
  @Roles('SUPERUSER', 'ADMIN')
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    try {
      return await this.roleService.remove(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to delete role');
    }
  }
}
