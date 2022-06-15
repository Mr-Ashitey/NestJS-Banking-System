import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthCredentailDto } from './dto/auth-credential.dto';
import { User } from './user.entity';
// import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  // sign up service
  //   async signUp(authCredentialsDto: AuthCredentailDto) {}

  // sign in service
  async signIn(authCredentialsDto: AuthCredentailDto) {
    const { email, password } = authCredentialsDto;

    const foundUser = await this.usersRepository.findOne({ where: { email } });

    // if (foundUser && bcrypt.compareSync(password, foundUser.password)) {
    // } else {
    //   throw new UnauthorizedException('Invalid credentials');
    // }
  }
}
