import { Controller, Post, Body, Get } from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-creditanals.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  signUp(@Body() authcredentialDto: AuthCredentialsDto): Promise<void> {
    return this.authService.signUp(authcredentialDto);
  }
}
