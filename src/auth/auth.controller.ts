import { Controller, Post, Body, UseGuards, Req, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { RegisterUserDto } from '../auth/dto/register-user.dto';
import { LocalAuthGuard } from './common/guards/local-auth.guard';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { Request } from 'express';

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
  async login(@Body() loginUserDto: LoginUserDto) {
    return await this.authService.login(loginUserDto);
  }

  // @UseGuards(JwtAuthGuard)
  // @Get('logout')
  // logout(@Req() req: Request) {
  //   this.authService.logout(req.user['sub']);
  // }
}
