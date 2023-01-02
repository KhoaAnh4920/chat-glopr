import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { RequestSendOTPDto, ValidateOTPDto } from './dto/user.dto';
import { Response } from 'express';
import { ValidateOTPViewReq } from 'src/otp/otp.type';
import { OtpService } from '../otp/otp.service';
import { CurrentUser, ICurrentUser, SetScopes } from '../shared/auth';
import { ISingleRes } from 'src/shared/response';
import { IUserInfo } from './user.type';
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly otpService: OtpService,
  ) {}

  @ApiTags('users')
  @Post('request-send-otp')
  @ApiOperation({ summary: 'Send OTP' })
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'Request send OTP',
  })
  public async requestSendOTP(
    @Body() payload: RequestSendOTPDto,
    @Res() res: Response,
  ): Promise<any> {
    const otpCode = await this.usersService.sendOTP({
      context: payload.context,
      otpMethod: payload.method,
      userIdentity: payload.identity,
      format: payload.format,
    });

    const singleRes = {
      success: true,
      data: { otpCode },
    };
    return res.status(HttpStatus.OK).send(singleRes);
  }

  @ApiTags('users')
  @Post('validate-otp')
  @ApiOperation({ summary: 'Validate  OTP' })
  @ApiOkResponse({ status: HttpStatus.OK, description: 'Validate OTP' })
  public async validateOtp(
    @Body() validateOTPDto: ValidateOTPDto,
    @Res() res: Response,
  ) {
    const modelReq = new ValidateOTPViewReq(
      validateOTPDto.context,
      validateOTPDto.identity,
      validateOTPDto.otpCode,
    );
    const result = await this.otpService.validateOTPVMobile(modelReq);

    const singleRes = {
      success: true,
      data: { result },
    };
    return res.status(HttpStatus.OK).send(singleRes);
  }

  @ApiTags('users')
  @Get('/me')
  @ApiBearerAuth()
  @SetScopes('user.get.me')
  @ApiOperation({ summary: 'Get user own info' })
  public async getMe(
    @CurrentUser() currentUser: ICurrentUser,
    @Res() res: Response,
  ) {
    const user = await this.usersService.findOne(currentUser.userId);
    user.password = undefined;
    const resBody: ISingleRes<IUserInfo> = {
      success: true,
      statusCode: 200,
      message: 'GET_DATA_SUCCEEDED',
      data: user,
    };

    return res.status(HttpStatus.OK).send(resBody);
  }
}
