import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const startTime = Date.now();
    const request = context.switchToHttp().getRequest();
    const { method, url } = request;
    console.log(`[${method}] ${url}...`);

    return next
      .handle()
      .pipe(
        tap(() =>
          console.log(
            `[${method}] ${url} completed in ${Date.now() - startTime}ms`,
          ),
        ),
      );
  }
}
