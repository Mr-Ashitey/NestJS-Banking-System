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
import * as randomstring from 'randomstring';

import { Utils } from 'src/utils/utils';
import { Mailer, MailerResponse } from 'src/utils/mailer';

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
    const { firstName, lastName, email, password, phone_no, date_of_birth } =
      createUserDto;

    // hash password
    const salt = bcrypt.genSaltSync();
    const hashedPassword = bcrypt.hashSync(password, salt);

    //create verification token
    const verificationToken = randomstring.generate();

    const foundUser = await this.usersRepository.findOne({ where: { email } });
    if (!foundUser) {
      const mailerResponse = await new Mailer(
        email,
        'Verify Account Details',
        'We have sent you a verification link at madcodein@gmail.com. Please verify account',
      ).sendMail();
      if (mailerResponse == MailerResponse.ERROR) {
        throw new InternalServerErrorException(
          'Seems there is a problem in sending you an email. Please check your connection and try again',
        );
      }
    }

    try {
      const user = this.usersRepository.create({
        firstName,
        lastName,
        userName: Utils.generateUsername(firstName, lastName),
        email,
        password: hashedPassword,
        phone_no,
        date_of_birth,
        verificationToken,
      });

      await this.usersRepository.save(user);

      return {
        email,
        success: 'User created successfully',
        info: 'Verify your account by following the mail sent to you.',
      };
    } catch (error) {
      throw new ConflictException(Utils.extractErrorMessage(error));
    }
  }

  // account verficiation

  // sign in service
  async signIn(authCredentialsDto: AuthCredentailDto) {
    const { email, password } = authCredentialsDto;

    const foundUser = await this.usersRepository.findOne({ where: { email } });

    if (!foundUser.active) {
      throw new UnauthorizedException('You need to verify email first');
    }
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
