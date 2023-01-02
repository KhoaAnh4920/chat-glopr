import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { UserDo } from 'src/_schemas/user.do';
import { AppError, ERROR_CODE } from '../../shared/error';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'identity' });
  }
  // Check user request //
  async validate(identity, password) {
    const user = await this.authService.validateUser(identity, password);
    if (!user) {
      throw new AppError(ERROR_CODE.UNAUTHORIZED);
    }
    return user;
  }
}
