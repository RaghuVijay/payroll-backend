// src/auth/services/role-mapping.service.ts
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRoles } from '../roles.entity';

@Injectable()
export class RoleMappingService implements OnModuleInit {
  private readonly logger = new Logger(RoleMappingService.name);

  private roleMapping: Record<string, string> = {};

  constructor(
    @InjectRepository(UserRoles)
    private readonly userRolesRepository: Repository<UserRoles>,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.initializeRoleMapping();
  }

  async initializeRoleMapping(): Promise<void> {
    try {
      const roles = await this.userRolesRepository.find();
      this.roleMapping = roles.reduce((acc, role) => {
        acc[role.role_name] = role.code;
        return acc;
      }, {});
      this.logger.log('Role mappings initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize role mappings', error.stack);
      throw new Error('Failed to initialize role mappings');
    }
  }

  getRoleCode(roleName: string): string {
    const roleCode = this.roleMapping[roleName];
    if (!roleCode) {
      this.logger.warn(`Role ${roleName} not found in the role mapping`);
      throw new Error(`Role ${roleName} not found in the role mapping`);
    }
    return roleCode;
  }
}
