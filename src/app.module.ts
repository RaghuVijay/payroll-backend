import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import appConfig from './config/app.config';
import databaseConfig from './config/database.config';
import environmentValidatation from './config/environment.validatation';

import jwtConfig from './auth/config/jwt.config';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { AccessTokenGuard } from './auth/guards/access-token/access-token.guard';
import { AuthenticationGuard } from './auth/guards/authentication/authentication.guard';
import { UsersModule } from './users/users.module';
import { UserCreds } from './auth/auth.entity';
import { UserRoles } from './auth/auth_roles.entity';
import { OrganizationController } from './organization/organization.controller';
import { OrganizationModule } from './organization/organization.module';
import { UserInfo } from './users/users.entity';
import { Features } from './auth/features.entity';
import { Rbac } from './auth/rbac.entity';
import { RolesGuard } from './auth/guards/rbac/rbac.guard';
import { RolesController } from './roles/roles.controller';
import { RolesModule } from './roles/roles.module';

const ENV = process.env.NODE_ENV;

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: !ENV ? '.env' : `.env.${ENV}`,
      load: [appConfig, databaseConfig],
      validationSchema: environmentValidatation,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        autoLoadEntities: configService.get('database.autoLoadEntities'),
        synchronize: configService.get('database.synchronize'),
        port: configService.get('database.port'),
        username: configService.get('database.user'),
        password: configService.get('database.password'),
        host: configService.get('database.host'),
        database: configService.get('database.name'),
        migrations: [],
        entities: [UserCreds, UserRoles, UserInfo, Features, Rbac],
      }),
    }),
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync(jwtConfig.asProvider()),
    UsersModule,
    OrganizationModule,
    RolesModule,
  ],
  controllers: [AppController, AuthController, OrganizationController, RolesController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard,
    },
    AccessTokenGuard,
    RolesGuard,
  ],
})
export class AppModule {}
