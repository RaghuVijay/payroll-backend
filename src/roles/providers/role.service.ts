import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRoles } from '../roles.entity';
import { CreateRoleDto } from '../dtos/creatRole.dto';
import { UpdateRoleDto } from '../dtos/updateRole.dto';
import { Status } from '../enums/statusType.enum';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(UserRoles)
    private readonly roleRepository: Repository<UserRoles>,
  ) {}

  async create(createRoleDto: CreateRoleDto): Promise<UserRoles> {
    const existingRole = await this.roleRepository.findOne({
      where: { role_name: createRoleDto.role_name },
    });
    if (existingRole) {
      throw new ConflictException('Role with this name already exists');
    }
    const role = this.roleRepository.create(createRoleDto);
    return this.roleRepository.save(role);
  }

  async findAll(): Promise<UserRoles[]> {
    return this.roleRepository.find();
  }

  async getAllActiveRoles(): Promise<UserRoles[]> {
    return this.roleRepository.find({ where: { status: Status.ACTIVATED } });
  }

  async findOne(id: string): Promise<UserRoles> {
    const role = await this.roleRepository.findOne({ where: { code: id } });
    if (!role) {
      throw new NotFoundException('Role not found');
    }
    return role;
  }

  async update(id: string, updateRoleDto: UpdateRoleDto): Promise<UserRoles> {
    const role = await this.findOne(id);
    Object.assign(role, updateRoleDto);
    return this.roleRepository.save(role);
  }

  async remove(id: string): Promise<void> {
    const role = await this.roleRepository.findOne({ where: { code: id } });
    if (!role) {
      throw new NotFoundException('Role not found');
    }
    try {
      const result = await this.roleRepository.softDelete({ code: id });
      if (result.affected === 0) {
        throw new InternalServerErrorException('Failed to delete role');
      }
    } catch (error) {
      throw new InternalServerErrorException('Failed to delete role');
    }
  }
}
