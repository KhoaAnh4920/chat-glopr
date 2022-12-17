import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { RegisterUserDto } from '../auth/dto/register-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}
  async register(registerUserDto: RegisterUserDto) {
    const user = await this.usersService.findOne(registerUserDto.email);
    if (user) {
      throw new HttpException(
        'User with this email exist',
        HttpStatus.BAD_REQUEST,
      );
    }
    const saltOrRounds = 10;
    const hash = await bcrypt.hash(registerUserDto.password, saltOrRounds);
    const createOne = await this.usersService.createOne({
      ...registerUserDto,
      password: hash,
    });
    if (createOne) {
      //   const payload = {
      //     email: createOne.email,
      //     sub: createOne._id,
      //   };
      //   return {
      //     access_token: this.jwtService.sign(payload),
      //   };
      return createOne;
    }
  }
}
