import { Controller, Post, Body, Get, ValidationPipe } from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-creditanals.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  signUp(
    @Body(ValidationPipe) authcredentialDto: AuthCredentialsDto,
  ): Promise<void> {
    return this.authService.signUp(authcredentialDto);
  }

  @Post('/signin')
  signIn(
    @Body(ValidationPipe) authcredentialDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.signIn(authcredentialDto);
  }
}
