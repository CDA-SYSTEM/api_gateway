import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, map } from 'rxjs';
import { ApiResponse } from '../interfaces/api-response.interface';
import { SKIP_RESPONSE_FORMAT_KEY } from '../decorators/skip-response-format.decorator';
import { safeParse } from '../utils/parse.util';
import { extractOrigin } from '../../cache/infrastructure/cache.service';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponse | any> {
    const skipFormat = this.reflector.getAllAndOverride<boolean>(SKIP_RESPONSE_FORMAT_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (skipFormat) {
      return next.handle();
    }

    const ctx = context.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    return next.handle().pipe(
      map((raw) => {
        const data = safeParse(raw) ?? null;
        return {
          statusCode: response.statusCode,
          message: 'Success',
          data,
          timestamp: new Date().toISOString(),
          path: request.url,
          origin: extractOrigin(raw),
        } as ApiResponse;
      }),
    );
  }
}
