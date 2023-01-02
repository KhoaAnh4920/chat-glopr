import { ContentRequestOTP, TypeSender } from '../otp/otp.enum';
import { RandomTypes } from '../shared/common/stringUtils';
import { UserGender } from '../users/users.enum';

export interface IUser {
  readonly id: string;
  readonly email: string;
  readonly phoneNumber: string;
  readonly fullName: string;
  readonly userName: string;
  password: string;
  readonly dob: Date;
  readonly gender: UserGender;
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
  readonly gender?: UserGender;
}

export class UpdateUserViewReq implements IUpdateUserViewReq {
  constructor(
    readonly id: string,
    readonly email?: string,
    readonly phoneNumber?: string,
    readonly fullName?: string,
    readonly avatar?: string,
    readonly dob?: Date,
    readonly password?: string,
    readonly gender?: UserGender,
  ) {}
}

export interface IUpdateUserModel {
  readonly id: string;
  readonly email: string;
  readonly phoneNumber?: string;
  readonly fullName?: string;
  readonly avatar?: string;
  readonly dob?: Date;
  readonly password?: string;
  readonly gender?: UserGender;
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
    readonly gender?: UserGender,
  ) {}
}
