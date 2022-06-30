import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentailDto } from './dto/auth-credential.dto';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signUp(@Body() createUserDto: CreateUserDto): Promise<object> {
    return this.authService.signUp(createUserDto);
  }

  @Get('user-verification/:verificationToken')
  async verifyUserAccount(
    @Param('verificationToken') verificationToken: string,
  ) {
    return this.authService.verifyUserAccount(verificationToken);
  }

  @Post('signin')
  async signIn(@Body() authCredentialsDto: AuthCredentailDto): Promise<object> {
    return this.authService.signIn(authCredentialsDto);
  }
}
