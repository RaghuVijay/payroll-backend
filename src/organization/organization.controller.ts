import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  NotFoundException,
  Query,
  Patch,
} from '@nestjs/common';
import { OrganizationService } from './providers/organization.service';
import { CreateOrganizationDto } from './dtos/organization.dto';
import { UpdateOrganizationDto } from './dtos/update.organization.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { AuthType } from 'src/auth/enums/auth-type.enum';
import { Userroles } from 'src/auth/enums/userroles.enum';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller('organizations')
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  // Create a new organization
  @Auth(AuthType.Bearer)
  @Roles(Userroles.HR)
  @Post()
  async create(@Body() createOrganizationDto: CreateOrganizationDto) {
    return await this.organizationService.create(createOrganizationDto);
  }

  // Get all organizations (no ID provided)
  @Auth(AuthType.Bearer)
  @Roles(Userroles.HR)
  @Get()
  async findAll(@Query('skip') skip?: number, @Query('take') take?: number) {
    return await this.organizationService.find(undefined, skip, take);
  }

  // Get one organization by ID (ID provided)
  @Auth(AuthType.Bearer)
  @Roles(Userroles.HR)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.organizationService.find(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }

  // Update an organization by ID
  @Auth(AuthType.Bearer)
  @Roles(Userroles.HR, Userroles.ADMIN)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateOrganizationDto: UpdateOrganizationDto,
  ) {
    try {
      return await this.organizationService.update(id, updateOrganizationDto);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }

  // Soft delete an organization by ID
  @Auth(AuthType.Bearer)
  @Roles(Userroles.HR)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      await this.organizationService.remove(id);
      return { message: 'Organization deleted successfully' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }
}
