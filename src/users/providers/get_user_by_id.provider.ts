import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserInfo } from '../users.entity';
import { UserCreds } from 'src/auth/auth.entity';

@Injectable()
export class GetUserByIdProvider {
  private readonly logger = new Logger(GetUserByIdProvider.name);

  constructor(
    @InjectRepository(UserInfo)
    private readonly usersRepository: Repository<UserInfo>,
  ) {}

  /**
   * Fetch a single user by code or all users with pagination.
   * @param param - The user code (optional).
   * @param skip - Number of records to skip (optional, for pagination).
   * @param take - Number of records to take (optional, for pagination).
   * @returns A single user or a list of users.
   */
  public async getUserByCodeOrAll(
    param?: string,
    skip?: number,
    take?: number,
  ): Promise<UserInfo | UserInfo[]> {
    try {
      if (param) {
        // Fetch a single user by code
        return await this.getUserByCode(param);
      } else {
        // Fetch all users with pagination
        return await this.getAllUsers(skip, take);
      }
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Fetch a single user by code.
   * @param code - The user code.
   * @returns The user with the specified code, including UserCreds data.
   */
  private async getUserByCode(code: string): Promise<UserInfo> {
    this.logger.debug(`Fetching user with code: ${code}`);
    const user = await this.usersRepository.findOne({
      where: { code },
      relations: ['cred'], // Include the related UserCreds data
    });

    if (!user) {
      this.logger.warn(`User with code ${code} not found`);
      throw new NotFoundException(`User with code ${code} not found`);
    }

    this.logger.debug(`User with code ${code} found`);
    return user;
  }

  /**
   * Fetch all users with pagination.
   * @param skip - Number of records to skip (optional).
   * @param take - Number of records to take (optional).
   * @returns A list of users, including UserCreds data.
   */
  private async getAllUsers(skip?: number, take?: number): Promise<UserInfo[]> {
    this.logger.debug('Fetching all users');
    const users = await this.usersRepository.find({
      skip,
      take,
      relations: ['userCreds'], // Include the related UserCreds data
    });

    if (users.length === 0) {
      this.logger.warn('No users found');
      throw new NotFoundException('No users found');
    }

    this.logger.debug(`Found ${users.length} users`);
    return users;
  }

  /**
   * Handle errors and log them.
   * @param error - The error object.
   */
  private handleError(error: Error): void {
    if (error instanceof NotFoundException) {
      throw error; // Re-throw NotFoundException
    } else {
      this.logger.error('Error fetching users:', error);
      throw new InternalServerErrorException(
        'An error occurred while fetching users',
      );
    }
  }
}
