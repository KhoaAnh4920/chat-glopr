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
import { ConfigService } from '@nestjs/config';
import { ValidateOTPViewReq } from '../otp/otp.type';
import { ContentRequestOTP } from '../otp/otp.enum';
import { OtpService } from '../otp/otp.service';
import { AppError, ERROR_CODE } from '../shared/error';
import {
  IChangePasswordViewReq,
  INewTokenResponse,
  IRefreshTokenReq,
} from './auth.type';
import { IUpdateUserViewReq } from '../users/user.type';
@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private configService: ConfigService,
    private readonly otpService: OtpService,
  ) {}

  async validateUser(identity, password) {
    const user = await this.usersService.findOne(identity);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      return user;
    }
  }

  async register(registerUserDto: RegisterUserDto) {
    const user = await this.usersService.checkUserExist(
      registerUserDto.email,
      registerUserDto.phoneNumber,
    );
    if (user) throw new AppError(ERROR_CODE.EMAIL_OR_PHONE_EXISTS);
    // console.log('otpCode: ', registerUserDto.otpCode);
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
      isActived: true,
    });
    if (newUser) {
      const tokens = await this.getTokens(newUser._id, newUser.email);
      await this.updateRefreshToken(newUser._id, tokens.refreshToken);
      return {
        _id: newUser._id,
        email: newUser.email,
        phoneNumber: newUser.phoneNumber,
        fullName: newUser.fullName,
        createdAt: newUser.createdAt,
        updatedAt: newUser.updatedAt,
      };
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const user = await this.validateUser(
      loginUserDto.identity,
      loginUserDto.password,
    );

    if (user) {
      const payload = {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        username: user.userName,
        phoneNumber: user.phoneNumber,
      };
      const { accessToken, refreshToken } = await this.getTokens(
        payload.id,
        payload.email,
      );
      return {
        access_token: accessToken,
        refreshToken: refreshToken,
        info: payload,
      };
    }
  }

  async getTokens(userId: string, email: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          userId,
          email,
        },
        {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
          // expiresIn: '15m',
        },
      ),
      this.jwtService.signAsync(
        {
          userId,
          email,
        },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: '90d',
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

  public async changePassword(
    changePasswordReq: IChangePasswordViewReq,
  ): Promise<void> {
    const user = await this.usersService.findOne(changePasswordReq.userId);

    const compareResult = await bcrypt.compare(
      changePasswordReq.currentPassword,
      user.password,
    );

    if (!compareResult) {
      throw new AppError(ERROR_CODE.UNAUTHORIZED);
    }

    const updateUserViewReq: IUpdateUserViewReq = {
      id: user.id,
      password: changePasswordReq.newPassword,
    };
    await this.usersService.updateUser(updateUserViewReq);
  }

  public async getNewToken(
    tokenRefresh: IRefreshTokenReq,
  ): Promise<INewTokenResponse> {
    // Verify //
    const tokenDecoded = this.jwtService.decode(tokenRefresh.refToken) as {
      [key: string]: any;
    };
    console.log('tokenDecoded: ', tokenDecoded);
    if (!tokenDecoded) throw new AppError(ERROR_CODE.INVALID_TOKEN);
    const user = await this.usersService.findOne(tokenDecoded.userId);
    if (!user) throw new AppError(ERROR_CODE.UNAUTHORIZED);
    const { accessToken } = await this.getTokens(user.id, user.email);
    return { newToken: accessToken };

    // const compareResult = await bcrypt.compare(
    //   changePasswordReq.currentPassword,
    //   user.password,
    // );

    // if (!compareResult) {
    //   throw new AppError(ERROR_CODE.UNAUTHORIZED);
    // }

    // const updateUserViewReq: IUpdateUserViewReq = {
    //   id: user.id,
    //   password: changePasswordReq.newPassword,
    // };
    // await this.usersService.updateUser(updateUserViewReq);
  }
}
