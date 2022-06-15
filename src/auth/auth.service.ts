import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthCredentailDto } from './dto/auth-credential.dto';
import { User } from './user.entity';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class AuthService {
  logger = new Logger('AuthService');
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  // sign up service
  async signUp(createUserDto: CreateUserDto) {
    const { username, email, password, phone_no, date_of_birth } =
      createUserDto;

    console.log(username, email, password, phone_no, date_of_birth);

    const salt = bcrypt.genSaltSync();
    const hashedPassword = bcrypt.hashSync(password, salt);

    const user = this.usersRepository.create({
      username,
      email,
      password: hashedPassword,
      phone_no,
      date_of_birth,
    });

    try {
      await this.usersRepository.save(user);

      return { email, success: 'User created successfully' };
    } catch (error) {
      // console.log(error);
      if (error.code === '23505') {
        throw new ConflictException('Username already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  // sign in service
  async signIn(authCredentialsDto: AuthCredentailDto) {
    const { email, password } = authCredentialsDto;

    const foundUser = await this.usersRepository.findOne({ where: { email } });

    if (foundUser && bcrypt.compareSync(password, foundUser.password)) {
      const payload = { email };
      const accessToken = await this.jwtService.sign(payload);

      return { accessToken };
    } else {
      this.logger.error(`Failed to sign in with email: ${email}`);
      throw new UnauthorizedException('Invalid credentials');
    }
  }
}
