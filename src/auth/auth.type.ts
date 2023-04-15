import { ICurrentUser } from '../shared/auth';
export type IPayloadJWT = ICurrentUser;

export interface IAuthResponse {
  readonly access_token: string;
  readonly info: any;
}

export interface IChangePasswordViewReq {
  readonly userId: string;
  readonly currentPassword: string;
  readonly newPassword: string;
}

export interface IUserCreated {
  readonly _id: string;
  readonly email: string;
  readonly phoneNumber: string;
  readonly fullName: string;
  readonly userName: string;
  readonly gender: string;
  readonly avatar?: string;
  readonly isDelete?: boolean;
}

export interface IRefreshTokenReq {
  readonly refToken: string;
}

export interface INewTokenResponse {
  readonly newToken: string;
}
