import { ContentRequestOTP } from './otp.enum';

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
