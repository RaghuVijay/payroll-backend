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
import { OrganizationController } from './organization/organization.controller';
import { OrganizationModule } from './organization/organization.module';
import { UserInfo } from './users/users.entity';
import { Features } from './auth/features.entity';
import { Rbac } from './auth/rbac.entity';
import { RolesGuard } from './auth/guards/rbac/rbac.guard';
import { RoleController } from './roles/roles.controller';
import { RolesModule } from './roles/roles.module';
import { PayslipController } from './payslip/payslip.controller';
import { PayslipModule } from './payslip/payslip.module';
import { UserRoles } from './roles/roles.entity';
import { PayrollSummary } from './payslip/payslip.entity';
import { IncomeDetails } from './payslip/incomeDetails.entity';

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
        entities: [
          UserCreds,
          UserInfo,
          Features,
          Rbac,
          UserRoles,
          PayrollSummary,
          IncomeDetails,
        ],
      }),
    }),
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync(jwtConfig.asProvider()),
    UsersModule,
    OrganizationModule,
    RolesModule,
    PayslipModule,
    PayslipModule,
  ],
  controllers: [
    AppController,
    AuthController,
    OrganizationController,
    RoleController,
    PayslipController,
  ],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard, // Apply AuthenticationGuard globally
    },
    AccessTokenGuard,
    RolesGuard,
  ],
})
export class AppModule {}
