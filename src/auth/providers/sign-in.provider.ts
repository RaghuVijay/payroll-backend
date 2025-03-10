import {
  Injectable,
  RequestTimeoutException,
  UnauthorizedException,
} from '@nestjs/common';
import { SignInDto } from '../dtos/signin.dto';
import { FindOneByEmailProvider } from './find-one-by-email.provider';
import { HashingProvider } from './hashing.provider';
import { GenerateTokensProvider } from './generate-token.provider';
import { GetUserByIdProvider } from 'src/users/providers/get_user_by_id.provider';
import { RoleBaseAccessProvider } from './role_base_access.provider';

@Injectable()
export class SignInProvider {
  constructor(
    private readonly findOneByEmail: FindOneByEmailProvider,
    private readonly hashingProvider: HashingProvider,
    private readonly generateTokenProvider: GenerateTokensProvider,
    private readonly getUserById: GetUserByIdProvider,
    private readonly roleBaseAccess: RoleBaseAccessProvider,
  ) {}

  public async signIn(signInDto: SignInDto) {
    const user = await this.findOneByEmail.findOneByEmail(signInDto.email);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (!user.role) {
      console.error('User role is missing:', user);
      throw new UnauthorizedException('User role is missing or invalid');
    }

    let isEqual: boolean = false;
    try {
      isEqual = await this.hashingProvider.comparePassword(
        signInDto.password,
        user.password,
      );
    } catch (error) {
      throw new RequestTimeoutException(error, {
        description: 'Could not compare password',
      });
    }

    if (!isEqual) {
      throw new UnauthorizedException('Password does not match');
    }

    const roles = await this.roleBaseAccess.roleBaseAccess(user.role);

    const tokens = await this.generateTokenProvider.generateTokens(user, roles);

    return { tokens };
  }
}
