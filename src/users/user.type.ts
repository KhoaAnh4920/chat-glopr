import { ContentRequestOTP, TypeSender } from '../otp/otp.enum';
import { RandomTypes } from '../shared/common/stringUtils';

export interface IUser {
  readonly id: string;
  readonly email: string;
  readonly phoneNumber: string;
  readonly fullName: string;
  readonly userName: string;
  password: string;
  readonly dob: Date;
  readonly avatar?: string;
  readonly createdAt?: Date;
}
export interface IUserInfo {
  readonly id: string;
  readonly email: string;
  readonly phoneNumber: string;
  readonly fullName: string;
  readonly userName: string;
  readonly dob: Date;
  readonly avatar?: string;
  readonly createdAt?: Date;
}
export interface ISendOtpViewReq {
  context: ContentRequestOTP;
  userIdentity: string;
  otpMethod: TypeSender;
  format: RandomTypes;
}

export interface IUpdateUserViewReq {
  readonly id: string;
  readonly email?: string;
  readonly phoneNumber?: string;
  readonly fullName?: string;
  readonly avatar?: string;
  readonly dob?: Date;
  readonly password?: string;
}

export interface IUpdateUserModel {
  readonly id: string;
  readonly email: string;
  readonly phoneNumber?: string;
  readonly fullName?: string;
  readonly avatar?: string;
  readonly dob?: Date;
  readonly password?: string;
}

export class UpdateUserModel implements IUpdateUserModel {
  constructor(
    readonly id: string,
    readonly email: string,
    readonly phoneNumber: string,
    readonly fullName: string,
    readonly dob: Date,
    readonly password: string,
    readonly avatar?: string,
  ) {}
}
