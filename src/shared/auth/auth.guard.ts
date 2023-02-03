import {
  Injectable,
  CanActivate,
  ExecutionContext,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

export const SetScopes = (...scopes: string[]) => SetMetadata('scopes', scopes);

@Injectable()
export class AuthGuard implements CanActivate {
  private jwtService: JwtService;
  constructor(private readonly reflector: Reflector) {
    const options = {
      secret: process.env.SECRET_JWT || 'SECRET_JWT',
    };
    this.jwtService = new JwtService(options);
  }

  canActivate(context: ExecutionContext): boolean {
    const allowedScopes = this.reflector.get<string[]>(
      'scopes',
      context.getHandler(),
    );

    if (!allowedScopes || !allowedScopes.length) {
      return true;
    }
    const request = context.switchToHttp().getRequest();

    if (!request.headers.authorization) return false;
    const token = request.headers.authorization.split(' ')[1];
    const tokenDecoded = this.jwtService.decode(token) as {
      [key: string]: any;
    };
    // console.log('tokenDecoded: ', tokenDecoded);
    // const tokenScopes = tokenDecoded['role']['scopes'];
    // const isMatch = this.matchScopes(allowedScopes, tokenScopes);
    // if (isMatch) {
    //   request.user = tokenDecoded;
    // }
    // return isMatch;
    request.user = tokenDecoded;
    return true;
  }

  // matchScopes(allowedScopes: string[], tokenScopes: string[]): boolean {
  //   const scopes = allowedScopes.filter((scope) => tokenScopes.includes(scope));
  //   if (scopes.length > 0) {
  //     return true;
  //   }
  //   return false;
  // }
}
