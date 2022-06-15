import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentailDto } from './dto/auth-credential.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  //   @Post('signup')

  @Post('signin')
  async signIn(@Body() authCredentialsDto: AuthCredentailDto): Promise<object> {
    return this.authService.signIn(authCredentialsDto);
  }
}
