import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from '../config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { ActiveUserData } from '../interface/active-user-data.interface';
import { UserCreds } from '../auth.entity';
import { Rbac } from '../rbac.entity';

@Injectable()
export class GenerateTokensProvider {
  constructor(
    private readonly jwtService: JwtService,

    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}

  public async signToken<T>(Id: string, expiresIn: number, payload?: T) {
    return await this.jwtService.signAsync(
      {
        sub: Id,
        ...payload,
      },
      {
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
        secret: this.jwtConfiguration.secret,
        expiresIn,
      },
    );
  }
  public async generateTokens(user: UserCreds, roles: Rbac[]) {
    console.log(user);

    const roleCodes = [...new Set(roles.map((role) => role.role.code))];
    const featureCodes = roles.map((role) => role.feature.code);

    const [accessToken, refreshToken] = await Promise.all([
      this.signToken<Partial<ActiveUserData>>(
        user.code,
        this.jwtConfiguration.accessTokenTtl,
        {
          email: user.email,
          role_codes: roleCodes,
          feature_codes: featureCodes,
        },
      ),
      this.signToken(user.id, this.jwtConfiguration.refreshTokenTtl),
    ]);

    return { accessToken, refreshToken };
  }
}
