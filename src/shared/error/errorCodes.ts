import { HttpStatus } from '@nestjs/common';

interface ErrorDetails {
  message: string;
  key: string;
  code: string;
}

enum ERROR_CODE {
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  PARAM_INVALID = 'PARAM_INVALID',
  UNEXPECTED_ERROR = 'UNEXPECTED_ERROR',
  UNAUTHORIZED = 'UNAUTHORIZED',
  INVALID_OTP = 'INVALID_OTP',
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  EMAIL_OR_PHONE_EXISTS = 'EMAIL_OR_PHONE_EXISTS',
  HTTP_CALL_ERROR = 'HTTP_CALL_ERROR',
  REFERENCE_ERROR = 'REFERENCE_ERROR',
  ROLE_NOT_FOUND = 'ROLE_NOT_FOUND',
  RESOURCE_NOT_FOUND = 'RESOURCE_NOT_FOUND',
  USER_EXISTED = 'USER_EXISTED',
  INVALID_PASSWORD = 'INVALID_PASSWORD',
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  YOU_HAVE_BEEN_SPAM = 'YOU_HAVE_BEEN_SPAM',
  YOU_HAVE_RECEIVED_CODE = 'YOU_HAVE_RECEIVED_CODE',
  EMAIL_INVALID = 'EMAIL_INVALID',
  INVALID_TOKEN = 'INVALID_TOKEN',
  FRIEND_EXISTS = 'FRIEND_EXISTS',
  INVITE_EXISTS = 'INVITE_EXISTS',
  NOT_FOUND_REQUEST = 'NOT_FOUND_REQUEST',
  NOT_FOUND_MESSAGE = 'NOT_FOUND_MESSAGE',
  PHONE_INVALID = 'PHONE_INVALID',
  NOT_FOUND_CONSERVATION = 'NOT_FOUND_CONSERVATION',
  USER_IDS_INVALID = 'USER_IDS_INVALID',
  MAX_PIN_MESSAGE = 'MAX_PIN_MESSAGE',
  EMAIL_HAS_BEEN_REGISTERED = 'EMAIL_HAS_BEEN_REGISTERED',
  MESSAGE_WAS_DELETED = 'MESSAGE_WAS_DELETED',
  GOOGLE_SERVICE_ACCOUNT_CREDS_NOT_FOUND = 'GOOGLE_SERVICE_ACCOUNT_CREDS_NOT_FOUND',
}

const ErrorList = {
  [ERROR_CODE.INTERNAL_SERVER_ERROR]: {
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    message: 'Internal server error',
  },
  [ERROR_CODE.PARAM_INVALID]: {
    statusCode: HttpStatus.BAD_REQUEST,
    message: 'Parameters invalid',
  },
  [ERROR_CODE.HTTP_CALL_ERROR]: {
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    message: 'Call http error',
  },
  [ERROR_CODE.UNEXPECTED_ERROR]: {
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    message: 'Unexpected error',
  },
  [ERROR_CODE.UNAUTHORIZED]: {
    statusCode: HttpStatus.UNAUTHORIZED,
    message: 'Invalid email or password',
  },
  [ERROR_CODE.INVALID_OTP]: {
    statusCode: HttpStatus.BAD_REQUEST,
    message: 'Invalid OTP',
  },
  [ERROR_CODE.USER_NOT_FOUND]: {
    statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
    message: 'User not found',
  },
  [ERROR_CODE.EMAIL_OR_PHONE_EXISTS]: {
    statusCode: HttpStatus.BAD_REQUEST,
    message: 'Email or phone exists',
  },
  [ERROR_CODE.REFERENCE_ERROR]: {
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    message: 'Cannot get reference info',
  },
  [ERROR_CODE.ROLE_NOT_FOUND]: {
    statusCode: HttpStatus.NOT_FOUND,
    message: 'Role not found',
  },
  [ERROR_CODE.RESOURCE_NOT_FOUND]: {
    statusCode: HttpStatus.BAD_REQUEST,
    message: 'Resource not found',
  },
  [ERROR_CODE.USER_EXISTED]: {
    statusCode: HttpStatus.CONFLICT,
    message: 'User existed',
  },
  [ERROR_CODE.INVALID_PASSWORD]: {
    statusCode: HttpStatus.BAD_REQUEST,
    message:
      'Password must has upper case, lower case, digits and must not has space',
  },
  [ERROR_CODE.PERMISSION_DENIED]: {
    statusCode: HttpStatus.FORBIDDEN,
    message: 'Permission denied',
  },
  [ERROR_CODE.YOU_HAVE_BEEN_SPAM]: {
    statusCode: HttpStatus.BAD_REQUEST,
    message: 'You have been sent sms 5 times! Please come back tomorrow',
  },
  [ERROR_CODE.YOU_HAVE_RECEIVED_CODE]: {
    statusCode: HttpStatus.BAD_REQUEST,
    message: 'You have been received code, please check your sms',
  },
  [ERROR_CODE.EMAIL_INVALID]: {
    statusCode: HttpStatus.BAD_REQUEST,
    message: 'Email address is not valid',
  },
  [ERROR_CODE.INVALID_TOKEN]: {
    statusCode: HttpStatus.BAD_REQUEST,
    message: 'Invalid token',
  },
  [ERROR_CODE.FRIEND_EXISTS]: {
    statusCode: HttpStatus.BAD_REQUEST,
    message: 'Friend exists',
  },
  [ERROR_CODE.INVITE_EXISTS]: {
    statusCode: HttpStatus.BAD_REQUEST,
    message: 'Invite exists',
  },
  [ERROR_CODE.NOT_FOUND_REQUEST]: {
    statusCode: HttpStatus.BAD_REQUEST,
    message: 'Friend request not found',
  },
  [ERROR_CODE.NOT_FOUND_MESSAGE]: {
    statusCode: HttpStatus.BAD_REQUEST,
    message: 'Message not found',
  },
  [ERROR_CODE.PHONE_INVALID]: {
    statusCode: HttpStatus.BAD_REQUEST,
    message: 'Phone number is not valid',
  },
  [ERROR_CODE.NOT_FOUND_CONSERVATION]: {
    statusCode: HttpStatus.BAD_REQUEST,
    message: 'Conversation not found',
  },
  [ERROR_CODE.USER_IDS_INVALID]: {
    statusCode: HttpStatus.BAD_REQUEST,
    message: 'UserId invalid',
  },
  [ERROR_CODE.MAX_PIN_MESSAGE]: {
    statusCode: HttpStatus.BAD_REQUEST,
    message: 'You can only pin up to 3 messages',
  },
  [ERROR_CODE.EMAIL_HAS_BEEN_REGISTERED]: {
    statusCode: HttpStatus.BAD_REQUEST,
    message: 'Your email has already been registered',
  },
  [ERROR_CODE.MESSAGE_WAS_DELETED]: {
    statusCode: HttpStatus.BAD_REQUEST,
    message: 'Message was deleted',
  },
  [ERROR_CODE.GOOGLE_SERVICE_ACCOUNT_CREDS_NOT_FOUND]: {
    statusCode: HttpStatus.BAD_REQUEST,
    message:
      'The $GOOGLE_SERVICE_ACCOUNT_CREDS environment variable was not found!',
  },
};
export { ErrorDetails, ERROR_CODE, ErrorList };
