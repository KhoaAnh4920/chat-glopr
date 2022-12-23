import { Injectable } from '@nestjs/common';
import { UserDocument } from 'src/_schemas/user.schema';
import { UpdateUserDto } from './dto/update-user.dto';
import { ISendOtpViewReq } from './user.type';
import { UsersRepository } from './users.repository';
import { ContentRequestOTP, TypeSender } from '../otp/otp.enum';
import { AppError, ERROR_CODE } from '../shared/error';
import { OtpService } from '../otp/otp.service';
import { OTP_EXPIRE_SECOND, OTP_LENGTH } from '../otp/otp.constant';
import { MailService } from '../mail/mail.service';
import { StringUtils } from '../shared/common/stringUtils';
@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly otpService: OtpService,
    private readonly mailService: MailService,
  ) {}

  async findOne(username): Promise<any> {
    return this.usersRepository.findOne(username);
  }

  async createOne(user): Promise<any> {
    const createOne = await this.usersRepository.createOne(user);
    return createOne;
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserDocument> {
    return this.usersRepository.updateUser(id, updateUserDto);
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
      //await this.mailService.sendUserOtp(userIdentity, otpCode);
    }

    if (otpMethod === TypeSender.SMS) {
      console.log('Nothing');
    }
    // try {
    //   const result = await this.sendSMS(userIdentity, otpCode);
    //   result.subscribe((data) => {
    //     const {
    //       data: { code, transactionid: transactionId, message },
    //     } = data;

    //     const history = new CreateHistoryModelReq(
    //       userIdentity,
    //       otpCode,
    //       otpMethod,
    //       context,
    //       transactionId,
    //       code,
    //       message,
    //     );
    //     this.historyService.createHistory(history);
    //   });
    // } catch (err) {
    //   console.log('ERR', err);
    // }

    return otpCode;
  }
}
