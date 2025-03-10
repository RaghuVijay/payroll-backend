import { Module, forwardRef } from '@nestjs/common';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserInfo } from './users.entity';
import { GetUserByIdProvider } from './providers/get_user_by_id.provider';
import { UpdateUsers } from './providers/update-users';
import { DeleteUsers } from './providers/delete-users';
import { AuthModule } from 'src/auth/auth.module';
import { UsersService } from './providers/users.service';

@Module({
  controllers: [UsersController],
  imports: [
    TypeOrmModule.forFeature([UserInfo]),
    forwardRef(() => AuthModule), // Use forwardRef to break the circular dependency
  ],
  providers: [GetUserByIdProvider, UpdateUsers, DeleteUsers, UsersService],
  exports: [GetUserByIdProvider, TypeOrmModule],
})
export class UsersModule {}
