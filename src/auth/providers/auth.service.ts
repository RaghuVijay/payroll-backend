import {
  BadRequestException,
  Inject,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserCreds } from '../auth.entity';
import { SignInDto } from '../dtos/signin.dto';
import { SignInProvider } from './sign-in.provider';
import { RefreshTokensProvider } from './refresh-tokens.provider';
import { RefreshToken } from '../dtos/refreshToken.dto';
import { ChangePasswordDto } from '../dtos/changePassword.dto';
import { ChangePasswordProvider } from './change-password.provider';
import { SignupDto } from '../dtos/signup.dto';
import { SignUp } from './sign-up.provider';
@Injectable()
export class AuthService {
  constructor(
    private readonly refreshTokenProvider: RefreshTokensProvider,

    private signInProvider: SignInProvider,

    private readonly changePasswordProvider: ChangePasswordProvider,

    private readonly signUpFunction: SignUp,
  ) {}
  public async signIn(signInDto: SignInDto) {
    return await this.signInProvider.signIn(signInDto);
  }

  public async refreshTokens(refreshTokenDto: RefreshToken) {
    return await this.refreshTokenProvider.refreshTokens(refreshTokenDto);
  }

  public async changePassword(changePasswordDto: ChangePasswordDto) {
    return await this.changePasswordProvider.changePassword(changePasswordDto);
  }

  public async signUpMembers(signupDto: SignupDto) {
    return await this.signUpFunction.signUpFunction(signupDto);
  }
}
