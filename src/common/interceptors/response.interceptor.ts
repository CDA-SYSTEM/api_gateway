import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { ApiResponse } from '../interfaces/api-response.interface';
import { safeParse } from '../utils/parse.util';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponse> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    return next.handle().pipe(
      map((raw) => {
        const data = safeParse(raw);
        console.log('[ResponseInterceptor] data type:', typeof data, '- is string?', typeof data === 'string');
        return {
          statusCode: response.statusCode,
          message: 'Success',
          data: data ?? null,
          timestamp: new Date().toISOString(),
          path: request.url,
        };
      }),
    );
  }
}
