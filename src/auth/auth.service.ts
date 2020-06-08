import { Injectable } from '@nestjs/common';
import { UserRepo } from './user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './dto/auth-creditanals.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepo)
    private userRepo: UserRepo,
  ) {}

  signUp(authcredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.userRepo.signUp(authcredentialsDto);
  }
}
