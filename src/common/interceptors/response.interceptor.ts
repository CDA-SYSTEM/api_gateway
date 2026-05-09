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
      map((raw) => ({
        statusCode: response.statusCode,
        message: 'Success',
        data: safeParse(raw) ?? null,
        timestamp: new Date().toISOString(),
        path: request.url,
      })),
    );
  }
}
