import {
  BadRequestException,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserCreds } from '../auth.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FindOneByIdProvider {
  constructor(
    @InjectRepository(UserCreds)
    private readonly authRepository: Repository<UserCreds>,
  ) {}
  public async findOneById(code: string) {
    let user = undefined;
    try {
      user = await this.authRepository.findOneBy({
        code,
      });
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment please try later',
        {
          description: 'Error connecting to the the datbase',
        },
      );
    }
    if (!user) {
      throw new BadRequestException('The user id does not exist');
    }

    return user;
  }
}
