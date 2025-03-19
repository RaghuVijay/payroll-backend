import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Rbac } from '../rbac.entity';
import { Repository } from 'typeorm';
import { UserRoles } from 'src/roles/roles.entity';

@Injectable()
export class RoleBaseAccessProvider {
  private readonly logger = new Logger(RoleBaseAccessProvider.name);

  constructor(
    @InjectRepository(Rbac)
    private readonly rbacRepository: Repository<Rbac>,
  ) {}

  public async roleBaseAccess(role: UserRoles): Promise<Rbac[] | null> {
    try {
      this.logger.log(
        `Searching for role_code: ${JSON.stringify(role, null, 2)}`,
      );

      // Validate role object
      if (!role || !role.code) {
        this.logger.error('Invalid role object. Missing role code.');
        return null;
      }

      // Fetch all features related to this role
      const roleData = await this.rbacRepository.find({
        where: { role: { code: role.code } },
        relations: ['feature', 'role'],
      });

      if (roleData.length === 0) {
        this.logger.warn(`No data found for role_code: ${role.code}`);
        return null;
      }

      this.logger.log(
        `Found ${roleData.length} records for role_code: ${role.code}`,
      );
      return roleData;
    } catch (error) {
      this.logger.error(`Failed to fetch role-based access: ${error.message}`);
      throw new Error(`Failed to fetch role-based access: ${error.message}`);
    }
  }
}
