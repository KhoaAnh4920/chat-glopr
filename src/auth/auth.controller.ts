import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Get,
  HttpStatus,
  Res,
  Patch,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  getSchemaPath,
} from '@nestjs/swagger';
import {
  RegisterUserDto,
  ResponseRegisterUserDto,
} from '../auth/dto/register-user.dto';
import { LocalAuthGuard } from './common/guards/local-auth.guard';
import { LoginUserDto, ResponseLoginUserDto } from './dto/login-user.dto';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { Request } from 'express';
import { ISingleRes } from '../shared/response';
import { Response } from 'express';
import {
  IAuthResponse,
  IChangePasswordViewReq,
  INewTokenResponse,
  IRefreshTokenReq,
  IUserCreated,
} from './auth.type';
import {
  ChangePasswordDto,
  NewTokenResponseDto,
  TokenRefreshDto,
} from './dto/auth.dto';
import { CurrentUser, ICurrentUser, SetScopes } from '../shared/auth';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: ResponseRegisterUserDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input',
  })
  async register(
    @Body() registerUserDto: RegisterUserDto,
    @Res() res: Response,
  ) {
    const created = await this.authService.register(registerUserDto);
    const bodyResponse: ISingleRes<IUserCreated> = {
      success: true,
      statusCode: 201,
      message: 'REGISTRATION_SUCCESS',
      data: created,
    };
    return res.status(HttpStatus.OK).send(bodyResponse);
  }

  @UseGuards(LocalAuthGuard) // Check user request is valid //
  @Post('login')
  @ApiResponse({
    status: HttpStatus.OK,
    type: ResponseLoginUserDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized || Invalid email or password',
  })
  async login(@Body() loginUserDto: LoginUserDto, @Res() res: Response) {
    const authRes = await this.authService.login(loginUserDto);
    const bodyResponse: ISingleRes<IAuthResponse> = {
      success: true,
      statusCode: 200,
      message: 'SIGN_IN_SUCCESSFULLY',
      data: authRes,
    };
    return res.status(HttpStatus.OK).send(bodyResponse);
  }

  @Patch('/me/password')
  @ApiBearerAuth()
  @SetScopes('user.update.me')
  @ApiOperation({ summary: 'User change password' })
  public async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @CurrentUser() currentUser: ICurrentUser,
    @Res() res: Response,
  ) {
    const changePasswordReq: IChangePasswordViewReq = {
      userId: currentUser.userId,
      currentPassword: changePasswordDto.currentPassword,
      newPassword: changePasswordDto.newPassword,
    };
    await this.authService.changePassword(changePasswordReq);
    return res.status(HttpStatus.NO_CONTENT).send();
  }

  @Patch('/token/refresh')
  @ApiOperation({ summary: 'Get new token' })
  @ApiResponse({ status: HttpStatus.OK, type: NewTokenResponseDto })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid token' })
  public async getNewToken(
    @Body() tokenRefreshDto: TokenRefreshDto,
    @Res() res: Response,
  ) {
    const tokenReq: IRefreshTokenReq = {
      refToken: tokenRefreshDto.refreshToken,
    };
    const newToken = await this.authService.getNewToken(tokenReq);

    const bodyResponse: ISingleRes<INewTokenResponse> = {
      success: true,
      statusCode: 201,
      message: 'CREATE_SUCCESS',
      data: newToken,
    };
    return res.status(HttpStatus.OK).send(bodyResponse);
  }

  // @UseGuards(JwtAuthGuard)
  // @Get('logout')
  // logout(@Req() req: Request) {
  //   this.authService.logout(req.user['sub']);
  // }
}
