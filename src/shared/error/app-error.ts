import { ERROR_CODE, ErrorList, ErrorDetails } from './errorCodes';
import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

class AppError extends Error {
  protected errorCode: ERROR_CODE;
  protected messageError: string;
  protected statusCode: HttpStatus;
  errors?: ErrorDetails[];
  constructor(
    errorCode: ERROR_CODE,
    messageError?: string,
    errors?: ErrorDetails[],
  ) {
    const error = ErrorList[errorCode];
    const message = messageError || error.message;
    super(message);
    this.errorCode = errorCode;
    this.statusCode = error.statusCode;
    this.name = AppError.name;
    this.message = message;
    this.errors = errors || [];
  }

  getErrors() {
    return {
      errors: this.errors,
      errorCode: this.errorCode,
      statusCode: this.statusCode,
      message: this.message,
    };
  }
}
@Catch()
class AllExceptionsFilter implements ExceptionFilter {
  catch(
    exception: HttpException | BadRequestException | AppError,
    host: ArgumentsHost,
  ) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const errorType = exception.constructor.name;
    console.error('exception:', exception);
    // this.logger.error(exception, errorType);
    switch (errorType) {
      case 'AppError':
        return this.renderAppError(exception, response);
      case 'BadRequestException':
        return this.renderBadRequestError(exception, response);
      default:
        return this.renderUnknownError(exception, response);
    }
  }

  private renderBadRequestError(exception: any, response: any) {
    const error = exception.getResponse();
    response.status(error.statusCode).send({
      errors: error.message,
      message: ErrorList[ERROR_CODE.PARAM_INVALID].message,
      errorCode: ERROR_CODE.PARAM_INVALID,
      timestamp: new Date().toISOString(),
    });
  }

  private renderAppError(exception: any, response: any) {
    const error = exception.getErrors();
    response.status(error.statusCode).send({
      timestamp: new Date().toISOString(),
      errorCode: error.errorCode,
      message: error.message,
      errors: error.errors,
    });
  }

  private renderUnknownError(exception: any, response: any) {
    const error =
      typeof exception.getResponse === 'function'
        ? exception.getResponse()
        : {};
    const status =
      error.statusCode ||
      ErrorList[ERROR_CODE.INTERNAL_SERVER_ERROR].statusCode;
    const message =
      error.message || ErrorList[ERROR_CODE.INTERNAL_SERVER_ERROR].message;
    const errorCode = error.error
      ? error.error.toUpperCase()
      : ERROR_CODE.INTERNAL_SERVER_ERROR;
    response.status(status).send({
      errorCode: errorCode,
      errors: [message],
      message: message,
      timestamp: new Date().toISOString(),
    });
  }
}

export { ErrorList, ERROR_CODE, AppError, AllExceptionsFilter };
