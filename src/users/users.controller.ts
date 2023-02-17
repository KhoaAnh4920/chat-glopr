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
  getSchemaPath,
} from '@nestjs/swagger';
import {
  GetInfoSummaryUserResponse,
  GetInfoUserResponse,
  GetSearchUserSummaryUserResponse,
  OtpResponse,
  PayloadGetDetailUserDto,
  PayloadGetSummaryUserDto,
  RequestSendOTPDto,
  ResetPasswordOtpDto,
  SearchUserDto,
  UpdateUserDto,
  ValidateOTPDto,
} from './dto/user.dto';
import { Response } from 'express';
import { ValidateOTPViewReq } from 'src/otp/otp.type';
import { OtpService } from '../otp/otp.service';
import { CurrentUser, ICurrentUser, SetScopes } from '../shared/auth';
import { ISingleRes, ResponseMessage } from 'src/shared/response';
import {
  IUserInfo,
  UpdateUserViewReq,
  ResetPasswordViewReq,
  IUser,
} from './user.type';
import { User, UserDocument } from 'src/_schemas/user.schema';
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
    type: OtpResponse,
  })
  @ApiOkResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input',
  })
  public async requestSendOTP(
    @Body() payload: RequestSendOTPDto,
    @Res() res: Response,
  ) {
    const otpCode = await this.usersService.sendOTP({
      context: payload.context,
      otpMethod: payload.method,
      userIdentity: payload.identity,
      format: payload.format,
    });

    const singleRes: ISingleRes<{ otpCode: string }> = {
      success: true,
      statusCode: 200,
      message: ResponseMessage.CREATE_SUCCESS,
      data: { otpCode },
    };
    return res.status(HttpStatus.OK).send(singleRes);
  }

  // @ApiTags('users')
  // @Post('validate-otp')
  // @ApiOperation({ summary: 'Validate  OTP' })
  // @ApiOkResponse({ status: HttpStatus.OK, description: 'Validate OTP' })
  // public async validateOtp(
  //   @Body() validateOTPDto: ValidateOTPDto,
  //   @Res() res: Response,
  // ) {
  //   const modelReq = new ValidateOTPViewReq(
  //     validateOTPDto.context,
  //     validateOTPDto.identity,
  //     validateOTPDto.otpCode,
  //   );
  //   const result = await this.otpService.validateOTPVMobile(modelReq);

  //   const singleRes: ISingleRes<{ result: boolean }> = {
  //     success: true,
  //     statusCode: 200,
  //     message: ResponseMessage.VERIFY_SUCCEEDED,
  //     data: { result },
  //   };
  //   return res.status(HttpStatus.OK).send(singleRes);
  // }

  @ApiTags('users')
  @Get('/me')
  @ApiBearerAuth()
  @SetScopes('user.get.me')
  @ApiOperation({ summary: 'Get user own info' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetInfoUserResponse,
  })
  public async getMe(
    @CurrentUser() currentUser: ICurrentUser,
    @Res() res: Response,
  ) {
    const user = await this.usersService.findOne(currentUser.userId);
    user.password = undefined;
    user.refreshToken = undefined;
    const resBody: ISingleRes<UserDocument> = {
      success: true,
      statusCode: 200,
      message: ResponseMessage.GET_DATA_SUCCEEDED,
      data: user,
    };

    return res.status(HttpStatus.OK).send(resBody);
  }

  @ApiTags('users')
  @Patch('/me')
  @SetScopes('user.update.me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user info' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetInfoUserResponse,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input',
  })
  public async updateCustomer(
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() currentUser: ICurrentUser,
    @Res() res: Response,
  ) {
    const updateCustomerViewReq = new UpdateUserViewReq(
      currentUser.userId,
      updateUserDto.email,
      updateUserDto.phoneNumber,
      updateUserDto.fullName,
      updateUserDto.avatar,
      updateUserDto.dob,
      '',
      updateUserDto.gender,
    );
    const updatedCustomer = await this.usersService.updateUser(
      updateCustomerViewReq,
    );
    const resBody: ISingleRes<UserDocument> = {
      success: true,
      statusCode: 200,
      message: ResponseMessage.GET_DATA_SUCCEEDED,
      data: updatedCustomer,
    };

    return res.status(HttpStatus.OK).send(resBody);
  }

  @ApiTags('users')
  @Patch('retrive-password')
  @ApiOperation({ summary: 'User reset password' })
  @ApiResponse({
    description: 'Reset password',
    status: HttpStatus.OK,
    schema: {
      example: { success: true },
    },
  })
  public async resetPassword(@Body() resetPasswordDto: ResetPasswordOtpDto) {
    const viewRequest = new ResetPasswordViewReq(
      resetPasswordDto.identity,
      resetPasswordDto.otpToken,
      resetPasswordDto.password,
    );
    await this.usersService.resetPassword(viewRequest);
    return { success: true };
  }

  @ApiTags('users')
  @Get('/:userName')
  @ApiOperation({ summary: 'Get a summary of information about user' })
  @ApiOkResponse({
    status: HttpStatus.OK,
    type: GetInfoSummaryUserResponse,
  })
  public async getUserSummaryInfo(
    @Param() params: PayloadGetSummaryUserDto,
    @Res() res: Response,
  ) {
    const user = await this.usersService.getUserSummaryInfo(params.userName);
    const resBody: ISingleRes<UserDocument> = {
      success: true,
      statusCode: 200,
      message: ResponseMessage.GET_DATA_SUCCEEDED,
      data: user,
    };

    return res.status(HttpStatus.OK).send(resBody);
  }

  @ApiTags('users')
  @Get('detail/:key')
  @ApiOperation({ summary: 'Get detail user by id or username' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetInfoUserResponse,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input',
  })
  public async getUserByIdentity(
    @Param() params: PayloadGetDetailUserDto,
    @Res() res: Response,
  ) {
    const user = await this.usersService.getUserByIdentity(params.key);
    const resBody: ISingleRes<UserDocument> = {
      success: true,
      statusCode: 200,
      message: ResponseMessage.GET_DATA_SUCCEEDED,
      data: user,
    };

    return res.status(HttpStatus.OK).send(resBody);
  }

  @ApiTags('users')
  @Get()
  @ApiOperation({ summary: 'Search user' })
  @ApiOkResponse({
    status: HttpStatus.OK,
    type: GetSearchUserSummaryUserResponse,
  })
  public async getlistUser(
    @Query() query: SearchUserDto,
    @Res() res: Response,
  ) {
    const data = await this.usersService.getlistUser(query.key);
    const resBody: ISingleRes<UserDocument[]> = {
      success: true,
      statusCode: 200,
      message: ResponseMessage.GET_DATA_SUCCEEDED,
      data: data,
    };

    return res.status(HttpStatus.OK).send(resBody);
  }
}
