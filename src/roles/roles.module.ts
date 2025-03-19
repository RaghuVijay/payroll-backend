import { Module } from '@nestjs/common';
import { RoleService } from './providers/role.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRoles } from './roles.entity';
import { RoleController } from './roles.controller';
import { RoleMappingService } from './providers/role-mapping-provider';

@Module({
  imports: [TypeOrmModule.forFeature([UserRoles])],
  providers: [RoleService, RoleMappingService],
  exports: [RoleService, TypeOrmModule],
  controllers: [RoleController],
})
export class RolesModule {}
