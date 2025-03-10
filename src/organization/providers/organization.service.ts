import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organization } from '../organization.entity';
import { CreateOrganizationDto } from '../dtos/organization.dto';
import { UpdateOrganizationDto } from '../dtos/update.organization.dto';

@Injectable()
export class OrganizationService {
  private readonly logger = new Logger(OrganizationService.name);

  constructor(
    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>,
  ) {}

  // Generic find method to fetch one or all organizations
  async find(
    id?: string,
    skip?: number,
    take?: number,
  ): Promise<Organization | Organization[]> {
    this.logger.debug(`Fetching organization(s) with ID: ${id || 'all'}`);
    if (id) {
      // Find one organization by ID
      const organization = await this.organizationRepository.findOne({
        where: { code: id },
      });
      if (!organization) {
        this.logger.warn(`Organization with ID ${id} not found`);
        throw new NotFoundException(`Organization with ID ${id} not found`);
      }
      return organization; // Return a single organization
    } else {
      // Find all organizations (excluding soft-deleted ones) with pagination
      return await this.organizationRepository.find({}); // Return an array of organizations
    }
  }

  // Create a new organization
  async create(
    createOrganizationDto: CreateOrganizationDto,
  ): Promise<Organization> {
    this.logger.debug('Creating a new organization');
    const organization = this.organizationRepository.create(
      createOrganizationDto,
    );
    return await this.organizationRepository.save(organization);
  }

  // Update an organization by ID
  async update(
    id: string,
    updateOrganizationDto: UpdateOrganizationDto,
  ): Promise<Organization> {
    this.logger.debug(`Updating organization with ID: ${id}`);
    const organization = await this.find(id); // Reuse the find method
    if (Array.isArray(organization)) {
      // This should never happen because `find(id)` returns a single organization
      throw new NotFoundException(`Organization with ID ${id} not found`);
    }
    Object.assign(organization, updateOrganizationDto); // Update fields
    organization.updated_at = new Date(); // Update the timestamp
    return await this.organizationRepository.save(organization); // Save the single organization
  }

  // Soft delete an organization by ID
  async remove(id: string): Promise<void> {
    this.logger.debug(`Soft deleting organization with ID: ${id}`);
    const organization = await this.find(id); // Reuse the find method
    if (Array.isArray(organization)) {
      // This should never happen because `find(id)` returns a single organization
      throw new NotFoundException(`Organization with ID ${id} not found`);
    }
    organization.deleted_at = new Date(); // Set deleted_at timestamp
    await this.organizationRepository.save(organization); // Save the single organization
  }
}
