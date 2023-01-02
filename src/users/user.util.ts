import * as bcrypt from 'bcrypt';
import { SALT_ROUNDS } from './user.constant';
import { UnauthorizedException } from '@nestjs/common';

// const hashPassword = (password: string): Promise<string> => {
//   return new Promise(function(resolve, reject) {
//     bcrypt.hash(password, SALT_ROUNDS, function(err, hash) {
//       if (err) return reject();
//       return resolve(hash);
//     });
//   });
// };
//
// const validatePassword = (
//   inputPwd: string,
//   hashPwd: string,
// ): Promise<boolean> => {
//   return bcrypt.compare(inputPwd, hashPwd, (err, isMatch) => {
//     if (err) throw new UnauthorizedException();
//     return isMatch;
//   });
// };
//
// export { hashPassword, validatePassword };

export class UserUtil {
  public static async hashPassword(plainPassword: string): Promise<string> {
    return new Promise((resolve, reject) => {
      bcrypt.hash(plainPassword, SALT_ROUNDS, function (err, hash) {
        if (err) return reject(err);
        return resolve(hash);
      });
    });
  }

  public static async validatePassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return new Promise((resolve) => {
      bcrypt.compare(plainPassword, hashedPassword, (err, isMatch) => {
        if (err) throw new UnauthorizedException();
        return resolve(isMatch);
      });
    });
  }
}
