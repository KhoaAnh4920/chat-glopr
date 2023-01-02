import { ICurrentUser } from '../shared/auth';
export type IPayloadJWT = ICurrentUser;

export interface IAuthResponse {
  readonly access_token: string;
  readonly info: any;
}

export interface IChangePasswordViewReq {
  readonly userId: number;
  readonly currentPassword: string;
  readonly newPassword: string;
}
