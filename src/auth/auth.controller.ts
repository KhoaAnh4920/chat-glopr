import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Get,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { RegisterUserDto } from '../auth/dto/register-user.dto';
import { LocalAuthGuard } from './common/guards/local-auth.guard';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { Request } from 'express';
import { ISingleRes } from '../shared/response';
import { Response } from 'express';
import { IAuthResponse } from './auth.type';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created.',
  })
  async register(@Body() registerUserDto: RegisterUserDto) {
    return await this.authService.register(registerUserDto);
  }

  @UseGuards(LocalAuthGuard) // Check user request is valid //
  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto, @Res() res: Response) {
    const authRes = await this.authService.login(loginUserDto);
    const bodyResponse: ISingleRes<IAuthResponse> = {
      success: true,
      status: 201,
      message: 'SIGN_IN_SUCCESSFULLY',
      data: authRes,
    };
    // return await this.authService.login(loginUserDto);
    return res.status(HttpStatus.OK).send(bodyResponse);
  }

  // @UseGuards(JwtAuthGuard)
  // @Get('logout')
  // logout(@Req() req: Request) {
  //   this.authService.logout(req.user['sub']);
  // }
}
