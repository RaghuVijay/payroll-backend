import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organization } from './organization.entity'; // Adjust the import based on your entity
import { OrganizationController } from './organization.controller';
import { OrganizationService } from './providers/organization.service'; // Ensure this import is correct

@Module({
  imports: [TypeOrmModule.forFeature([Organization])], // Register the entity
  controllers: [OrganizationController],
  providers: [OrganizationService], // Provide the service
  exports: [OrganizationService, TypeOrmModule], // Export the service if needed elsewhere
})
export class OrganizationModule {}
