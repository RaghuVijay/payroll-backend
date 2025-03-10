import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserInfo } from '../users.entity';
import { Repository } from 'typeorm';
import { UpdateUserDto } from '../dtos/update-Users.dto';
import { convertDate } from 'src/auth/utils/dateconverter';

@Injectable()
export class UpdateUsers {
  constructor(
    @InjectRepository(UserInfo)
    private readonly usersRepository: Repository<UserInfo>,
  ) {}

  public async updateUserInfo(updateUserDto: UpdateUserDto, code: string) {
    try {
      // Step 1: Find the user by code
      const user = await this.usersRepository.findOne({ where: { code } });

      if (!user) {
        throw new NotFoundException(`User with code ${code} not found`);
      }

      // Step 2: Validate the updateUserDto (optional, if not already validated by DTO)
      if (Object.keys(updateUserDto).length === 0) {
        throw new BadRequestException('No fields provided for update');
      }

      // Step 3: Parse the dob string into a Date object (if provided)
      if (updateUserDto.dob) {
        try {
          // Convert the date from DD-MM-YYYY to YYYY-MM-DD
          updateUserDto.dob = convertDate(updateUserDto.dob);

          // Validate the converted date
          const dob = new Date(updateUserDto.dob);
          if (isNaN(dob.getTime())) {
            throw new BadRequestException('Invalid date of birth');
          }
        } catch (error) {
          throw new BadRequestException(
            'Invalid date of birth format. Expected DD-MM-YYYY',
          );
        }
      }

      // Step 4: Update the user entity with the new data
      const updatedUser = Object.assign(user, updateUserDto);

      // Step 5: Save the updated user entity
      await this.usersRepository.save(updatedUser);

      // Step 6: Return the updated user
      return updatedUser;
    } catch (error) {
      // Handle specific errors
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error; // Re-throw known exceptions
      } else {
        // Log the error and throw a generic error message
        console.error('Error updating user:', error);
        throw new InternalServerErrorException(
          'An error occurred while updating the user',
        );
      }
    }
  }
}
