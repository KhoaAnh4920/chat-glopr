import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';
import {
  RegisterUserDto,
  ResponseRegisterUserDto,
} from '../auth/dto/register-user.dto';
import { CurrentUser, ICurrentUser, SetScopes } from '../shared/auth';
import { ISingleRes } from '../shared/response';
import { AuthService } from './auth.service';
import {
  IAuthResponse,
  IChangePasswordViewReq,
  INewTokenResponse,
  IRefreshTokenReq,
  IUserCreated,
} from './auth.type';
import { GoogleAuthGuard } from './common/guards/google-auth.guard';
import { LocalAuthGuard } from './common/guards/local-auth.guard';
import {
  ChangePasswordDto,
  NewTokenResponseDto,
  TokenRefreshDto,
} from './dto/auth.dto';
import { LoginUserDto, ResponseLoginUserDto } from './dto/login-user.dto';
import { UsersModule } from 'src/users/users.module';
import { UserSchema } from 'src/_schemas/user.schema';
import { User } from 'src/_schemas/user.schema';
import { ApiException } from 'src/shared/common/api-exception.model';

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
  @ApiBadRequestResponse({ type: ApiException })
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

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  @ApiBearerAuth()
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async googleAuth(@Req() req) {}

  @Get('/google/redirect')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req) {
    return this.authService.googleLogin(req);
  }
}
