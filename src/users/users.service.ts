import { Injectable } from '@nestjs/common';
import { User, UserDocument } from 'src/_schemas/user.schema';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ICreateSocialTokenViewReq,
  ICreateUserFromSocialViewReq,
  ICreateUserViewReq,
  IResetPasswordViewReq,
  ISendOtpViewReq,
  IUser,
  UpdateUserModel,
  UpdateUserViewReq,
} from './user.type';
import { UsersRepository } from './users.repository';
import { ContentRequestOTP, TypeSender } from '../otp/otp.enum';
import { AppError, ERROR_CODE } from '../shared/error';
import { OtpService } from '../otp/otp.service';
import { OTP_EXPIRE_SECOND, OTP_LENGTH } from '../otp/otp.constant';
import { MailService } from '../mail/mail.service';
import { StringUtils } from '../shared/common/stringUtils';
import { IUpdateUserViewReq } from '../users/user.type';
import { UserUtil } from './user.util';
import { Types } from 'mongoose';
import { ValidateOTPViewReq } from 'src/otp/otp.type';
import {
  UserSocialToken,
  UserSocialTokenDocument,
} from 'src/_schemas/user_socialtoken';
import { UpdateResult } from 'mongodb';
@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly otpService: OtpService,
    private readonly mailService: MailService,
  ) {}

  public async findOne(indentity: string): Promise<UserDocument> {
    return this.usersRepository.findOne(indentity);
  }

  public async findOneSocialToken(
    socialId: string,
    type: string,
  ): Promise<any> {
    return this.usersRepository.findOneSocialToken(socialId, type);
  }

  public async checkUserExist(identity: string): Promise<boolean> {
    return !!(await this.usersRepository.findUserWithEmailOrPhone(identity));
  }

  public async createOne(
    user: ICreateUserViewReq | ICreateUserFromSocialViewReq,
  ): Promise<User> {
    const createOne = await this.usersRepository.createOne(user);
    return createOne;
  }
  public async createOneSocialToken(
    newSocialToken: ICreateSocialTokenViewReq,
  ): Promise<UserSocialToken> {
    const createOne = await this.usersRepository.createOneSocialToken(
      newSocialToken,
    );
    return createOne;
  }

  public async updateSocialToken(
    id: string,
    accessToken: string,
    refresh_token?: string,
  ): Promise<UpdateResult> {
    return this.usersRepository.updateSocialToken(
      id,
      accessToken,
      refresh_token,
    );
  }

  public async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserDocument> {
    return this.usersRepository.updateUser(id, updateUserDto);
  }

  public async updateLastLogin(id: string): Promise<void> {
    await this.usersRepository.updateLastLogin(id);
  }

  public async sendOTP(payload: ISendOtpViewReq): Promise<string> {
    const { userIdentity, context, format, otpMethod } = payload;

    const user = await this.findOne(userIdentity);
    if (!user && context === ContentRequestOTP.RESET_PASSWORD) {
      throw new AppError(ERROR_CODE.USER_NOT_FOUND);
    }
    const otpCode = await this.otpService.generateOtp(
      context,
      userIdentity,
      OTP_EXPIRE_SECOND,
      OTP_LENGTH,
      format,
    );
    if (otpMethod === TypeSender.EMAIL) {
      const checkEmail = StringUtils.validateEmail(userIdentity);
      if (!checkEmail) throw new AppError(ERROR_CODE.EMAIL_INVALID);
      await this.mailService.sendUserOtp(userIdentity, otpCode);
    }
    if (otpMethod === TypeSender.SMS) {
      console.log('Nothing');
      // Send sms otp //
      const checkPhone = StringUtils.isVietnamesePhoneNumber(userIdentity);
      if (!checkPhone) throw new AppError(ERROR_CODE.PHONE_INVALID);
    }

    return otpCode;
  }

  public async updateUser(viewReq: IUpdateUserViewReq): Promise<UserDocument> {
    const user = await this.findOne(viewReq.id);
    if (!user) {
      throw new AppError(ERROR_CODE.USER_NOT_FOUND);
    }
    const password = viewReq.password
      ? await UserUtil.hashPassword(viewReq.password)
      : user.password;
    const payload = new UpdateUserModel(
      user.id,
      viewReq.email || user.email,
      viewReq.phoneNumber || user.phoneNumber,
      viewReq.fullName || user.fullName,
      viewReq.dob || user.dob,
      password,
      viewReq.avatar || user.avatar,
      viewReq.gender || user.gender,
    );

    const updatedUser = await this.usersRepository.updateUser(
      payload.id,
      payload,
    );
    updatedUser.password = undefined;
    updatedUser.refreshToken = undefined;
    return updatedUser;
  }

  public async resetPassword(viewReq: IResetPasswordViewReq): Promise<void> {
    const payload = new ValidateOTPViewReq(
      ContentRequestOTP.RESET_PASSWORD,
      viewReq.userIdentity,
      viewReq.otpToken,
    );
    await this.otpService.validateOTPVMobile(payload);

    const user = await this.findOne(payload.userIdentity);

    const newPassword = await UserUtil.hashPassword(viewReq.password);

    const payloadUpdate = new UpdateUserModel(
      user.id,
      user.email,
      user.phoneNumber,
      user.fullName,
      user.dob,
      newPassword,
      user.gender,
    );
    try {
      await this.usersRepository.updateUser(payloadUpdate.id, payloadUpdate);
      return;
    } catch (error) {
      throw new AppError(ERROR_CODE.UNEXPECTED_ERROR);
    }
  }

  public async getUserSummaryInfo(userName: string): Promise<UserDocument> {
    const user = await this.usersRepository.getUserSummaryInfo(userName);
    if (!user) throw new AppError(ERROR_CODE.USER_NOT_FOUND);
    return user;
  }

  public async getUserByIdentity(key: string): Promise<UserDocument> {
    const user = await this.usersRepository.findOne(key);
    if (!user) throw new AppError(ERROR_CODE.USER_NOT_FOUND);
    user.password = undefined;
    user.refreshToken = undefined;
    return user;
  }

  public async getlistUser(key: string): Promise<UserDocument[]> {
    const user = await this.usersRepository.getlistUser(key);
    if (!user) throw new AppError(ERROR_CODE.USER_NOT_FOUND);
    return user;
  }
}
