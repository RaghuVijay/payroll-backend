import { Module } from '@nestjs/common';
import { RoleService } from './providers/role.service';

@Module({
  providers: [RoleService],
})
export class RolesModule {}
