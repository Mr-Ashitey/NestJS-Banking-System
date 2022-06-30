import {
  BadRequestException,
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

    // check if user already exists in the database
    const foundUser = await this.usersRepository.findOne({
      where: { email },
    });
    if (foundUser) {
      throw new ConflictException('Email already exists.');
    }

    // verify user email as a valid email address
    try {
      await Utils.verifyEmail(email);
    } catch (error) {
      throw new BadRequestException(error);
    }

    // hash password
    const salt = bcrypt.genSaltSync();
    const hashedPassword = bcrypt.hashSync(password, salt);

    //create verification token
    const verificationToken = randomstring.generate();

    // send verificationToken to user to verify account via mail
    const mailerResponse = await new Mailer(
      email,
      'Verify Account Details',
      `http://localhost:3000/verify_email/${verificationToken}`,
    ).sendMail();

    if (mailerResponse == MailerResponse.ERROR) {
      throw new InternalServerErrorException(
        'Seems there is a problem in sending you an email. Check the email you entered and also check your connection and try again',
      );
    }

    // save user credentials into database
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
  async verifyUserAccount(verificationToken: string) {
    const foundUser = await this.usersRepository.findOne({
      where: {
        verificationToken,
      },
    });

    if (!foundUser) {
      throw new ConflictException(
        'Problem encountered in user account verification.',
      );
    }

    if (foundUser.active) {
      throw new ConflictException('Account has already been verified');
    }

    foundUser.active = true;
    foundUser.verificationToken = '';

    try {
      await this.usersRepository.save(foundUser);

      return {
        success: 'Account verification successful',
      };
    } catch (error) {
      throw new ConflictException(Utils.extractErrorMessage(error));
    }
  }

  // sign in service
  async signIn(authCredentialsDto: AuthCredentailDto) {
    const { email, password } = authCredentialsDto;

    const foundUser = await this.usersRepository.findOne({ where: { email } });

    if (foundUser !== null && !foundUser.active) {
      throw new UnauthorizedException('You need to verify email first');
    }
    if (foundUser && bcrypt.compareSync(password, foundUser.password)) {
      const payload = { email };
      const accessToken = this.jwtService.sign(payload);

      return { accessToken };
    } else {
      this.logger.error(`Failed to sign in with email: ${email}`);
      throw new UnauthorizedException('Invalid credentials');
    }
  }
}
