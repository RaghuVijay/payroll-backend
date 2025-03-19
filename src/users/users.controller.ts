import {
  Controller,
  Get,
  Param,
  Patch,
  Delete,
  Body,
  NotFoundException,
  InternalServerErrorException,
  Query,
  Logger,
} from '@nestjs/common';
import { UsersService } from './providers/users.service';
import { UpdateUserDto } from './dtos/update-Users.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Userroles } from 'src/auth/enums/userroles.enum';
import { AuthType } from 'src/auth/enums/auth-type.enum';
import { Auth } from 'src/auth/decorators/auth.decorator';

@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);

  constructor(private readonly usersService: UsersService) {}

  /**
   * Fetch all users with pagination.
   * @param skip - Number of records to skip (optional).
   * @param take - Number of records to take (optional).
   * @returns A list of users.
   */
  @Auth(AuthType.Bearer)
  @Roles('ROLE0001')
  @Get()
  async getUsers(@Query('skip') skip?: number, @Query('take') take?: number) {
    try {
      this.logger.debug('Fetching all users');
      return await this.usersService.getUsers(undefined, skip, take);
    } catch (error) {
      this.handleError(error, 'fetching users');
    }
  }

  /**
   * Fetch a single user by code.
   * @param code - The user code.
   * @returns The user with the specified code.
   */
  @Auth(AuthType.Bearer)
  @Roles('ROLE0001')
  @Get(':code')
  async getUserByCode(@Param('code') code: string) {
    try {
      this.logger.debug(`Fetching user with code: ${code}`);
      return await this.usersService.getUsers(code);
    } catch (error) {
      this.handleError(error, 'fetching user');
    }
  }

  /**
   * Update a user by code.
   * @param code - The user code.
   * @param updateUserDto - The data to update the user.
   * @returns The updated user.
   */
  @Auth(AuthType.Bearer)
  @Roles('ROLE0001')
  @Patch(':code')
  async updateUser(
    @Param('code') code: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    try {
      this.logger.debug(`Updating user with code: ${code}`);
      return await this.usersService.updateUser(updateUserDto, code);
    } catch (error) {
      this.handleError(error, 'updating user');
    }
  }

  /**
   * Delete a user by code.
   * @param code - The user code.
   * @returns A success message or void.
   */
  @Auth(AuthType.Bearer)
  @Roles('ROLE0001')
  @Delete(':code')
  async deleteUser(@Param('code') code: string) {
    try {
      this.logger.debug(`Deleting user with code: ${code}`);
      return await this.usersService.DeleteUsers(code);
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
