import { Injectable } from '@nestjs/common';
import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
import { RandomTypes, StringUtils } from '../shared/common/stringUtils';
import { CacheRepository } from '../shared/cache/cache.repository';
import { AppError, ERROR_CODE } from '../shared/error';
import { OTP_COUNT } from './otp.constant';
// import { OTP_COUNT } from './otp.constant';
import { ContentRequestOTP } from './otp.enum';
import {
  IValidateEmailOrPhoneOTPViewReq,
  IValidateOTPViewReq,
} from './otp.type';

@Injectable()
export class OtpService {
  constructor(private readonly cacheRepository: CacheRepository) {}
  public async generateOtpOnlyNumber(length: number): Promise<string> {
    const otp = StringUtils.randomString(length, RandomTypes.NUMBER_ONLY);
    return otp;
  }
  public async generateOtp(
    context: ContentRequestOTP,
    userIdentity: string,
    secondsExpire: number,
    length: number,
    format?: RandomTypes,
  ): Promise<string> {
    const otp = StringUtils.randomString(
      length,
      format || RandomTypes.STRING_NUMBER,
    );
    const key = `otp_${userIdentity}_${context}`;
    dayjs.extend(utc);
    const nowUtc = dayjs().utc().valueOf();
    const checkKey = await this.cacheRepository.checkKey(key, 'otp');
    const count = await this.cacheRepository.increaseCount(key);
    const checkTime = await this.cacheRepository.checkTimeSending(key);
    const checkSpam = await this.cacheRepository.checkSpam(key);
    if (checkSpam) {
      throw new AppError(ERROR_CODE.YOU_HAVE_BEEN_SPAM);
    }
    if (!checkTime) {
      throw new AppError(ERROR_CODE.YOU_HAVE_RECEIVED_CODE);
    }
    await this.cacheRepository.del(key);
    const cacheObject = [
      'otp',
      otp,
      'timeSending',
      nowUtc.toString(),
      'count',
      count.toString(),
    ];
    if (checkKey) {
      await this.cacheRepository.set(key, cacheObject);
    } else {
      const count = OTP_COUNT;
      const cacheObject = [
        'otp',
        otp,
        'timeSending',
        nowUtc.toString(),
        'count',
        count.toString(),
      ];
      await this.cacheRepository.setKeyToRedis(key, secondsExpire, cacheObject);
    }
    return otp;
  }

  public async validateOTP(
    payload: IValidateEmailOrPhoneOTPViewReq,
  ): Promise<boolean> {
    const keyPhone = `otp_${payload.userPhone}_${payload.context}`;
    const keyEmail = `otp_${payload.userEmail}_${payload.context}`;
    const tempObject = await this.cacheRepository.hgetall(keyPhone);
    const requestObject =
      Object.keys(tempObject).length !== 0
        ? tempObject
        : await this.cacheRepository.hgetall(keyEmail);
    if (
      requestObject &&
      requestObject['otp'] &&
      requestObject['otp'] === payload.otpCode
    ) {
      await this.cacheRepository.del(keyPhone);
      return true;
    }
    throw new AppError(ERROR_CODE.INVALID_OTP);
  }

  public async validateOTPVMobile(
    payload: IValidateOTPViewReq,
  ): Promise<boolean> {
    const key = `otp_${payload.userIdentity}_${payload.context}`;
    const requestObject = await this.cacheRepository.hgetall(key);
    if (
      requestObject &&
      requestObject['otp'] &&
      requestObject['otp'] === payload.otpCode
    ) {
      return true;
    }

    throw new AppError(ERROR_CODE.INVALID_OTP);
  }
}
