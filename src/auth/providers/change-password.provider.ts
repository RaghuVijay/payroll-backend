import {
  Injectable,
  RequestTimeoutException,
  UnauthorizedException,
} from '@nestjs/common';
import { HashingProvider } from './hashing.provider';
import { ChangePasswordDto } from '../dtos/changePassword.dto';
import { FindOneByEmailProvider } from './find-one-by-email.provider';
import { InjectRepository } from '@nestjs/typeorm';
import { UserCreds } from '../auth.entity';
import { DeepPartial, Repository } from 'typeorm';

@Injectable()
export class ChangePasswordProvider {
  constructor(
    private readonly hashProvider: HashingProvider,
    private readonly findOneByEmail: FindOneByEmailProvider,
    @InjectRepository(UserCreds)
    private readonly credRepository: Repository<UserCreds>,
  ) {}

  public async changePassword(
    changePasswordDto: ChangePasswordDto,
  ): Promise<string> {
    // Find user by email
    const user = await this.findOneByEmail.findOneByEmail(
      changePasswordDto.email,
    );
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Compare current password with stored password
    let isEqual: boolean = false;
    try {
      isEqual = await this.hashProvider.comparePassword(
        changePasswordDto.currentPassword,
        user.password,
      );
    } catch (error) {
      throw new RequestTimeoutException('Could not compare passwords', {
        description: error.message,
      });
    }

    // If current password is incorrect
    if (!isEqual) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    // Hash the new password
    const hashPassword = await this.hashProvider.hashPassword(
      changePasswordDto.newPassword,
    );
    user.password = hashPassword; // Update password

    // Save the updated user entity with the new password
    try {
      await this.credRepository.save(user as DeepPartial<UserCreds>);
    } catch (error) {
      throw new RequestTimeoutException('Could not update password', {
        description: error.message,
      });
    }

    // Return success message
    return 'Password changed successfully';
  }
}
