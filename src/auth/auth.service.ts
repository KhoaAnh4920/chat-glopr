import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { RegisterUserDto } from '../auth/dto/register-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from './dto/login-user.dto';
import { UserDo } from 'src/_schemas/user.do';
import { ConfigService } from '@nestjs/config';
import { ValidateOTPViewReq } from '../otp/otp.type';
import { ContentRequestOTP } from '../otp/otp.enum';
import { OtpService } from '../otp/otp.service';
@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private configService: ConfigService,
    private readonly otpService: OtpService,
  ) {}

  async validateUser(email, password): Promise<UserDo> {
    const user = await this.usersService.findOne(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      return user;
    }
  }

  async register(registerUserDto: RegisterUserDto) {
    const user = await this.usersService.findOne(registerUserDto.email);
    if (user) {
      throw new HttpException(
        'User with this email exist',
        HttpStatus.BAD_REQUEST,
      );
    }
    console.log('otpCode: ', registerUserDto.otpCode);
    const payload = new ValidateOTPViewReq(
      ContentRequestOTP.CREATE_USERS,
      registerUserDto.phoneNumber,
      registerUserDto.otpCode,
    );
    await this.otpService.validateOTP(payload);
    const hash = await this.hashData(registerUserDto.password);
    const newUser = await this.usersService.createOne({
      ...registerUserDto,
      password: hash,
    });
    if (newUser) {
      const tokens = await this.getTokens(newUser._id, newUser.email);
      await this.updateRefreshToken(newUser._id, tokens.refreshToken);
      return {
        _id: newUser._id,
        email: newUser.email,
        createdAt: newUser.createdAt,
        updatedAt: newUser.updatedAt,
      };
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const user = await this.validateUser(
      loginUserDto.email,
      loginUserDto.password,
    );

    if (user) {
      const payload = {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        username: user.userName,
        phoneNumber: user.phoneNumber,
      };
      return {
        success: true,
        status: 201,
        message: 'SIGN_IN_SUCCESSFULLY',
        data: {
          access_token: this.jwtService.sign(payload),
          info: payload,
        },
      };
    }
  }

  async getTokens(userId: string, username: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
        },
        {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
          expiresIn: '15m',
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
        },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: '7d',
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  hashData(data: string) {
    const saltOrRounds = 10;
    return bcrypt.hash(data, saltOrRounds);
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken = await this.hashData(refreshToken);
    await this.usersService.update(userId, {
      refreshToken: hashedRefreshToken,
    });
  }
}
