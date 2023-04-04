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
import { ValidateEmailOrPhoneOTPViewReq } from '../otp/otp.type';
import { ContentRequestOTP } from '../otp/otp.enum';
import { OtpService } from '../otp/otp.service';
import { AppError, ERROR_CODE } from '../shared/error';
import {
  IChangePasswordViewReq,
  INewTokenResponse,
  IRefreshTokenReq,
} from './auth.type';
import {
  ICreateSocialTokenViewReq,
  ICreateUserFromSocialViewReq,
  IUpdateUserViewReq,
} from '../users/user.type';
import { Types } from 'mongoose';
import { SocialAuthType } from './constants';
import { StringUtils } from 'src/shared/common/stringUtils';
@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private configService: ConfigService,
    private readonly otpService: OtpService,
  ) {}

  public async validateUser(identity, password) {
    const user = await this.usersService.findOne(identity);
    if (!user) {
      throw new AppError(ERROR_CODE.UNAUTHORIZED);
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      return user;
    }
  }

  public async register(registerUserDto: RegisterUserDto) {
    const user = await this.usersService.checkUserExist(
      registerUserDto.identity,
    );

    if (user) throw new AppError(ERROR_CODE.EMAIL_OR_PHONE_EXISTS);
    const payload = new ValidateEmailOrPhoneOTPViewReq(
      ContentRequestOTP.CREATE_USERS,
      registerUserDto.identity,
      registerUserDto.identity,
      registerUserDto.otpCode,
    );
    await this.otpService.validateOTP(payload);
    const hash = await this.hashData(registerUserDto.password);
    const isEmail = StringUtils.validateEmail(registerUserDto.identity);
    let newUser = null;
    if (isEmail) {
      newUser = await this.usersService.createOne({
        ...registerUserDto,
        password: hash,
        email: registerUserDto.identity,
        isActived: true,
      });
    } else {
      newUser = await this.usersService.createOne({
        ...registerUserDto,
        password: hash,
        phoneNumber: registerUserDto.identity,
        isActived: true,
      });
    }

    if (newUser) {
      const tokens = await this.getTokens(
        newUser._id,
        newUser.email,
        SocialAuthType.REGISTER,
      );
      await this.updateRefreshToken(newUser._id, tokens.refreshToken);
      return {
        _id: newUser._id,
        email: newUser.email,
        phoneNumber: newUser.phoneNumber,
        fullName: newUser.fullName,
        userName: newUser.userName,
        gender: newUser.gender,
      };
    }
    // return user;
  }

  public async login(loginUserDto: LoginUserDto) {
    const user = await this.validateUser(
      loginUserDto.identity,
      loginUserDto.password,
    );

    if (user) {
      console.log('Check last login: ', user.lastLogin);
      const payload = {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        userName: user.userName,
        phoneNumber: user.phoneNumber,
        avatar: user.avatar || '',
        dob: user.dob || null,
        gender: user.gender,
        lastLogin: !user.lastLogin ? null : new Date(),
      };
      // Update last login //
      await this.usersService.updateLastLogin(user.id);
      //
      const { accessToken, refreshToken } = await this.getTokens(
        payload.id,
        payload.email,
        SocialAuthType.REGISTER,
      );
      return {
        access_token: accessToken,
        refreshToken: refreshToken,
        info: payload,
      };
    }
  }

  public async getTokens(userId: string, email: string, type: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          userId,
          email,
          type,
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
          type,
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

  public async updateRefreshToken(userId: string, refreshToken: string) {
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
    const { accessToken } = await this.getTokens(
      user.id,
      user.email,
      SocialAuthType.REGISTER,
    );
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

  public async googleLogin(req): Promise<any> {
    if (!req.user) {
      return 'No user from google';
    }
    // Check if user exists //
    const social_token = await this.usersService.findOneSocialToken(
      `G-${req.user.id}`,
      SocialAuthType.GOOGLE,
    );
    if (!social_token) {
      const user = await this.usersService.findOne(req.user.email);
      if (user && user.password)
        throw new AppError(ERROR_CODE.EMAIL_HAS_BEEN_REGISTERED);
      const newUser: ICreateUserFromSocialViewReq = {
        fullName: req.user.displayName,
        avatar: req.user.picture,
        email: req.user.email,
        isActived: true,
      };
      try {
        // Create new user //
        const result = await this.usersService.createOne(newUser);
        // generate new token //
        const { accessToken } = await this.getTokens(
          result._id,
          req.user.email,
          SocialAuthType.GOOGLE,
        );
        req.user.accessToken = accessToken;
        // Create new social token //
        console.log('refreshToken: ', req.user.refreshToken);
        console.log('req.user: ', req.user);
        const newSocialToken: ICreateSocialTokenViewReq = {
          socialId: `G-${req.user.id}`,
          type: SocialAuthType.GOOGLE,
          userId: result._id,
          accessToken: accessToken,
          refreshToken: req.user.refreshToken,
        };
        await this.usersService.createOneSocialToken(newSocialToken);
      } catch (error) {
        console.log('error: ', error);
        throw new AppError(ERROR_CODE.UNEXPECTED_ERROR);
      }
    } else {
      const { accessToken } = await this.getTokens(
        social_token.userId,
        req.user.email,
        SocialAuthType.GOOGLE,
      );
      req.user.accessToken = accessToken;
      await this.usersService.updateSocialToken(
        social_token._id,
        accessToken,
        req.user.refreshToken,
      );
    }

    return {
      success: true,
      statusCode: 200,
      message: 'User information from google',
      data: req.user,
    };
  }
}
