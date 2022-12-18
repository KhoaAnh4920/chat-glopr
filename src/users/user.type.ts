import { ContentRequestOTP, TypeSender } from '../otp/otp.enum';
import { RandomTypes } from '../shared/common/stringUtils';

export interface ISendOtpViewReq {
  context: ContentRequestOTP;
  userIdentity: string;
  otpMethod: TypeSender;
  format: RandomTypes;
}
