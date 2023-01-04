export interface ISingleRes<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  metadata?: any;
}

export interface IListRes<T> {
  success: boolean;
  data: T[];
  total?: number;
  metadata?: any;
}

export interface IEmptyRes {
  success: boolean;
}

export interface IEmptyDataRes {
  success: boolean;
  statusCode: number;
  message: string;
  data: [];
  metadata?: any;
}

export interface IListModels<T> {
  data: T[];
  total: number;
}

export interface ILoadMoreList<T> {
  data: T[];
  loadMore: boolean;
}

export enum ResponseMessage {
  //Validation message
  INVALID_CUSTOM_ERROR = 'INVALID_CUSTOM_ERROR',
  INVALID_INPUT = 'INVALID_INPUT',
  INVALID_DATA = 'INVALID_DATA',
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  VERIFY_EMAIL_SUCCEEDED = 'VERIFY_EMAIL_SUCCEEDED',
  INACTIVE_USER = 'INACTIVE_USER',
  INVALID_TOKEN = 'INVALID_TOKEN',
  VERIFY_SUCCEEDED = 'VERIFY_SUCCEEDED',
  // Not found Message
  NOT_FOUND = 'NOT_FOUND',
  MULTIPLE_NOT_FOUND = 'MULTIPLE_NOT_FOUND',

  // AUTHENTICATION message
  LOGIN_SUCCEEDED = 'LOGIN_SUCCEEDED',
  SIGN_IN_SUCCESSFULLY = 'SIGN_IN_SUCCESSFULLY',
  AUTHENTICATION_FAILED = 'AUTHENTICATION_FAILED',
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  REGISTRATION_SUCCESS = 'REGISTRATION_SUCCESS',
  GET_NEW_ACCESS_TOKEN_SUCCESS = 'GET_NEW_ACCESS_TOKEN_SUCCESS',

  // GET message
  GET_USER_PROFILE = 'GET_USER_PROFILE',
  GET_PRESIGNED_URLS = 'GET_PRESIGNED_URLS',
  GET_DATA_SUCCEEDED = 'GET_DATA_SUCCEEDED',
  UPDATE_DATA_SUCCEEDED = 'UPDATE_DATA_SUCCEEDED',

  // CREATE message
  CREATE_SUCCESS = 'CREATE_SUCCESS',
  CREATE_FAILURE_MESSAGE = 'CREATE_FAILURE_MESSAGE',

  // UPDATE message
  UPDATE_PROFILE_SUCCESS = 'UPDATE_PROFILE_SUCCESS',
  UPDATE_STATUS_ACCOUNT = 'UPDATE_STATUS_ACCOUNT',
  UPDATE_SHIPPING_ADDRESS_SUCCESS = 'UPDATE_SHIPPING_ADDRESS_SUCCESS',

  // DELETE message
  DELETE_DATA_SUCCEEDED = 'DELETE_DATA_SUCCEEDED',

  // PASSWORD message
  PASSWORD_NO_CHANGE = 'PASSWORD_NO_CHANGE',
  PASSWORD_NOT_MATCHED = 'PASSWORD_NOT_MATCHED',
  PASSWORD_NOT_PASS_VALIDATORS = 'PASSWORD_NOT_PASS_VALIDATORS',
  PASSWORD_CHANGED_SUCCEEDED = 'PASSWORD_CHANGED_SUCCEEDED',
  OLD_PASSWORD_NOT_MATCHED = 'OLD_PASSWORD_NOT_MATCHED',
}
