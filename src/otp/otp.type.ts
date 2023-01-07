import { ContentRequestOTP } from './otp.enum';

export interface IValidateEmailOrPhoneOTPViewReq {
  readonly context: ContentRequestOTP;
  readonly userPhone: string;
  readonly userEmail: string;
  readonly otpCode: string;
}
export class ValidateEmailOrPhoneOTPViewReq
  implements IValidateEmailOrPhoneOTPViewReq
{
  constructor(
    readonly context: ContentRequestOTP,
    readonly userPhone: string,
    readonly userEmail: string,
    readonly otpCode: string,
  ) {}
}

export interface IValidateOTPViewReq {
  readonly context: ContentRequestOTP;
  readonly userIdentity: string;
  readonly otpCode: string;
}
export class ValidateOTPViewReq implements IValidateOTPViewReq {
  constructor(
    readonly context: ContentRequestOTP,
    readonly userIdentity: string,
    readonly otpCode: string,
  ) {}
}
