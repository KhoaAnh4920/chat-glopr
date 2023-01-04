import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ICurrentUser } from './auth.type';

export const CurrentUser = createParamDecorator(
  (_: any, ctx: ExecutionContext): ICurrentUser => {
    const request = ctx.switchToHttp().getRequest();
    //console.log('request.user: ', request.user);
    const currentUser: ICurrentUser = {
      userId: request.user.userId,
      // role: request.user.role,
      // externalId: request.user.externalId,
    };
    return currentUser;
  },
);
