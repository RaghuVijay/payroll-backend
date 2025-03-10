import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { UserCreds } from '../auth.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserInfo } from 'src/users/users.entity';
import { SignupDto } from '../dtos/signup.dto';
import { HashingProvider } from './hashing.provider';
import { Organization } from 'src/organization/organization.entity'; // Import Organization entity
import { convertDate } from '../utils/dateconverter';

@Injectable()
export class SignUp {
  constructor(
    @InjectRepository(UserCreds)
    private readonly userCredsRepository: Repository<UserCreds>,

    @InjectRepository(UserInfo)
    private readonly userInfoRepository: Repository<UserInfo>,

    @InjectRepository(Organization) // Inject Organization repository
    private readonly organizationRepository: Repository<Organization>,

    @Inject(forwardRef(() => HashingProvider))
    private readonly hashingProvider: HashingProvider,
  ) {}

  public async signUpFunction(signupDto: SignupDto) {
    try {
      // Validate the input DTO
      if (!signupDto || Object.keys(signupDto).length === 0) {
        throw new BadRequestException('Signup data is required');
      }

      // Check if a user with the same email already exists
      const existingUser = await this.userCredsRepository.findOne({
        where: { email: signupDto.email },
      });

      if (existingUser) {
        throw new BadRequestException('Email already exists');
      }

      // Parse the dob string into a Date object
      const dobParts = signupDto.dob.split('-');
      if (dobParts.length !== 3) {
        throw new BadRequestException('Invalid date of birth format');
      }

      const dob = convertDate(signupDto.dob);

      // Fetch the Organization entity
      const organization = await this.organizationRepository.findOne({
        where: { code: signupDto.organization_code },
      });

      if (!organization) {
        throw new BadRequestException('Organization not found');
      }

      // Create UserCreds entity
      const userCredsObj = {
        email: signupDto.email,
        password: await this.hashingProvider.hashPassword(signupDto.password),
        role_code: signupDto.role_code,
      };

      const createCreds = this.userCredsRepository.create(userCredsObj);
      const savedCreds = await this.userCredsRepository.save(createCreds);

      // Create UserInfo entity
      const userInfoObj = {
        cred: savedCreds, // Assign the entire UserCreds entity
        name: signupDto.name,
        surname: signupDto.surname,
        dob, // Use the parsed Date object
        organization, // Assign the entire Organization entity
        gender: signupDto.gender,
        is_active: signupDto.is_active,
      };

      const createInfo = this.userInfoRepository.create(userInfoObj);
      const savedInfo = await this.userInfoRepository.save(createInfo);

      // Return a success response
      return {
        status: 'success',
        message: 'User signed up successfully',
        data: {
          userCreds: savedCreds,
          userInfo: savedInfo,
        },
      };
    } catch (error) {
      // Handle specific errors
      if (error.code === '23505') {
        // PostgreSQL duplicate key error (e.g., duplicate email)
        throw new BadRequestException('Email already exists');
      } else if (error instanceof BadRequestException) {
        // Re-throw BadRequestException as is
        throw error;
      } else {
        // Log the error and throw a generic error message
        console.error('Error during signup:', error);
        throw new InternalServerErrorException(
          'An error occurred during signup',
        );
      }
    }
  }
}
