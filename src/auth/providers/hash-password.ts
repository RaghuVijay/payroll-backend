import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserCreds } from '../auth.entity';

@Injectable()
export class PasswordHasher {
  constructor(
    @InjectRepository(UserCreds)
    private readonly credRepository: Repository<UserCreds>,
  ) {}

  public async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password, salt);
  }

  public async hashAndUpdatePasswords(): Promise<void> {
    const users = await this.credRepository.find();

    for (const user of users) {
      if (!user.password.startsWith('$2b$')) {
        // Check if the password is not already hashed
        const hashedPassword = await this.hashPassword(user.password);
        user.password = hashedPassword;
        await this.credRepository.save(user);
        console.log(`Hashed password for user: ${user.email}`);
      }
    }
  }
}
