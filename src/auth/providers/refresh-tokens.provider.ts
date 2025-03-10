import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from '../config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { AuthService } from './auth.service';
import { GenerateTokensProvider } from './generate-token.provider';
import { RefreshToken } from '../dtos/refreshToken.dto';
import { ActiveUserData } from '../interface/active-user-data.interface';
import { FindOneByIdProvider } from './find-one-by-id.provider';
import { UserInfo } from 'src/users/users.entity';

import { UserCreds } from '../auth.entity';
import { GetUserByIdProvider } from 'src/users/providers/get_user_by_id.provider';
import { RoleBaseAccessProvider } from './role_base_access.provider';

@Injectable()
export class RefreshTokensProvider {
  constructor(
    private readonly jwtService: JwtService,

    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,

    private readonly generateTokensProvider: GenerateTokensProvider,

    private readonly findOneByID: FindOneByIdProvider,

    private readonly findUserByID: GetUserByIdProvider,
    private readonly roleBaseAccess: RoleBaseAccessProvider,
  ) {}

  public async refreshTokens(refreshTokenDto: RefreshToken) {
    try {
      const { sub } = await this.jwtService.verifyAsync<
        Pick<ActiveUserData, 'sub'>
      >(refreshTokenDto.refreshToken, {
        secret: this.jwtConfiguration.secret,
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
      });
      const user: UserCreds = await this.findOneByID.findOneById(sub);
      const userCode: UserInfo | UserInfo[] =
        await this.findUserByID.getUserByCodeOrAll(user.code);
      const roles = await this.roleBaseAccess.roleBaseAccess(user.role);
      return await this.generateTokensProvider.generateTokens(user, roles);
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}
