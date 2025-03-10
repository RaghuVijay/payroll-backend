import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { UpdateUsers } from './update-users';
import { GetUserByIdProvider } from './get_user_by_id.provider';
import { DeleteUsers } from './delete-users';
import { UpdateUserDto } from '../dtos/update-Users.dto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    private readonly updateUsers: UpdateUsers,
    private readonly findUser: GetUserByIdProvider,
    private readonly deleteUser: DeleteUsers,
  ) {}

  /**
   * Fetch a single user by code or all users.
   * @param code - The user code (optional).
   * @returns A single user or a list of users.
   */
  public async getUsers(code?: string, skip?: number, take?: number) {
    try {
      this.logger.debug(`Fetching user(s) with code: ${code || 'all'}`);
      return await this.findUser.getUserByCodeOrAll(code, skip, take);
    } catch (error) {
      this.handleError(error, 'fetching users');
    }
  }

  /**
   * Update a user by code.
   * @param body - The data to update the user.
   * @param code - The user code.
   * @returns The updated user.
   */
  public async updateUser(body: UpdateUserDto, code: string) {
    try {
      this.logger.debug(`Updating user with code: ${code}`);
      return await this.updateUsers.updateUserInfo(body, code);
    } catch (error) {
      this.handleError(error, 'updating user');
    }
  }

  /**
   * Delete a user by code.
   * @param code - The user code.
   * @returns A success message or void.
   */
  public async DeleteUsers(code: string) {
    try {
      this.logger.debug(`Deleting user with code: ${code}`);
      return await this.deleteUser.deleteUsers(code);
    } catch (error) {
      this.handleError(error, 'deleting user');
    }
  }

  /**
   * Handle errors and log them.
   * @param error - The error object.
   * @param context - The context in which the error occurred (e.g., "fetching users").
   */
  private handleError(error: Error, context: string): void {
    if (error instanceof NotFoundException) {
      this.logger.warn(`Error ${context}: ${error.message}`);
      throw error; // Re-throw NotFoundException
    } else {
      this.logger.error(`Error ${context}:`, error);
      throw new InternalServerErrorException(
        `An error occurred while ${context}`,
      );
    }
  }
}
