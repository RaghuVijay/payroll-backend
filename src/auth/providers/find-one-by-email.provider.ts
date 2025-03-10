import {
  Injectable,
  RequestTimeoutException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserCreds } from '../auth.entity';

@Injectable()
export class FindOneByEmailProvider {
  constructor(
    @InjectRepository(UserCreds)
    private readonly credRepository: Repository<UserCreds>,
  ) {}

  public async findOneByEmail(email: string): Promise<UserCreds> {
    let user: UserCreds | null = null;

    try {
      // Fetch the user with the role relation included
      user = await this.credRepository.findOne({
        where: { email },
        relations: ['role'], // Include the role relation
      });

      // Log the user object for debugging
      console.log('User:', user);

      // Check if the user exists
      if (!user) {
        throw new NotFoundException(`User with email ${email} does not exist.`);
      }

      // Check if the user has a valid role
      if (!user.role) {
        console.error('User role is missing:', user);
        throw new InternalServerErrorException(
          'User role is missing or invalid.',
        );
      }

      return user;
    } catch (error) {
      // Handle database errors (e.g., connection issues)
      if (
        error instanceof NotFoundException ||
        error instanceof InternalServerErrorException
      ) {
        throw error; // Re-throw specific errors
      }
      throw new RequestTimeoutException(
        'Could not fetch user due to a timeout or database error.',
      );
    }
  }
}
