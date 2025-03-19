import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './providers/auth.service';
import { BcryptProvider } from './providers/bcrypt.provider';
import { HashingProvider } from './providers/hashing.provider';
import { GenerateTokensProvider } from './providers/generate-token.provider';
import { ConfigModule } from '@nestjs/config';
import jwtConfig from './config/jwt.config';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FindOneByEmailProvider } from './providers/find-one-by-email.provider';
import { SignInProvider } from './providers/sign-in.provider';
import { RefreshTokensProvider } from './providers/refresh-tokens.provider';
import { FindOneByIdProvider } from './providers/find-one-by-id.provider';
import { ChangePasswordProvider } from './providers/change-password.provider';
import { UserCreds } from './auth.entity';

import { RoleBaseAccessProvider } from './providers/role_base_access.provider';
import { Features } from './features.entity';
import { Rbac } from './rbac.entity';
import { SignUp } from './providers/sign-up.provider';
import { OrganizationModule } from 'src/organization/organization.module';
import { RolesModule } from 'src/roles/roles.module';

@Module({
  providers: [
    AuthService,
    {
      provide: HashingProvider,
      useClass: BcryptProvider,
    },
    GenerateTokensProvider,
    FindOneByEmailProvider,
    SignInProvider,
    RefreshTokensProvider,
    FindOneByIdProvider,
    ChangePasswordProvider,
    RoleBaseAccessProvider,
    SignUp,
  ],
  imports: [
    forwardRef(() => UsersModule), // Use forwardRef to break the circular dependency
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync(jwtConfig.asProvider()),
    TypeOrmModule.forFeature([UserCreds, Features, Rbac]),
    OrganizationModule,
    RolesModule,
  ],
  exports: [AuthService, HashingProvider, TypeOrmModule],
})
export class AuthModule {}
