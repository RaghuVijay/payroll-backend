import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserCreds } from 'src/auth/auth.entity';
import { UserInfo } from '../users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DeleteUsers {
  private readonly logger = new Logger(DeleteUsers.name); // Add logger here

  constructor(
    @InjectRepository(UserCreds)
    private readonly userCredsRepository: Repository<UserCreds>,
    @InjectRepository(UserInfo)
    private readonly userInfoRepository: Repository<UserInfo>,
  ) {}

  public async deleteUsers(code: string) {
    try {
      this.logger.debug(`Deleting user with code: ${code}`);

      // Step 1: Find the user in user_info table
      const userInfo = await this.userInfoRepository.findOne({
        where: { code: code },
        relations: ['cred'], // Ensure we load the relation to avoid undefined errors
      });

      if (!userInfo) {
        this.logger.warn(`User with code ${code} not found in user_info`);
        throw new NotFoundException(`User with code ${code} not found`);
      }

      this.logger.debug(`Found user_info record: ${JSON.stringify(userInfo)}`);

      // Step 2: Soft delete user_info (cascade will handle userCreds deletion)
      await this.userInfoRepository.softRemove(userInfo);
      this.logger.debug(`Soft deleted user_info record for code: ${code}`);

      // Step 3: Return success message
      return { message: `User with code ${code} deleted successfully` };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error; // Re-throw NotFoundException
      } else {
        this.logger.error('Error deleting user:', error);
        throw new InternalServerErrorException(
          'An error occurred while deleting the user',
        );
      }
    }
  }
}
