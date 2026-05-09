import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiResponse } from '../interfaces/api-response.interface';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status: number;
    let message: string;
    let error: string;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (exception instanceof BadRequestException) {
        const resp = exceptionResponse as any;
        if (Array.isArray(resp.message)) {
          message = resp.message.join(', ');
          error = 'Validation Error';
        } else {
          message = typeof resp === 'string' ? resp : resp.message;
          error = 'Bad Request';
        }
      } else {
        const resp = exceptionResponse;
        message = typeof resp === 'string' ? resp : (resp as any).message || exception.message;
        error = (resp as any).error || this.getDefaultError(status);
      }
    } else if (exception instanceof Error) {
      const err = exception as Error & { code?: string };

      if (err.code === 'ECONNREFUSED' || err.code === 'ENOTFOUND') {
        status = HttpStatus.BAD_GATEWAY;
        message = 'El servicio solicitado no está disponible en este momento';
        error = 'Service Unavailable';
      } else {
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        message = 'Ocurrió un error interno en el servidor';
        error = 'Internal Server Error';
      }
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Ocurrió un error inesperado';
      error = 'Internal Server Error';
    }

    const body: ApiResponse = {
      statusCode: status,
      message,
      error,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    response.status(status).json(body);
  }

  private getDefaultError(status: number): string {
    const errors: Record<number, string> = {
      [HttpStatus.BAD_REQUEST]: 'Bad Request',
      [HttpStatus.UNAUTHORIZED]: 'Unauthorized',
      [HttpStatus.FORBIDDEN]: 'Forbidden',
      [HttpStatus.NOT_FOUND]: 'Not Found',
      [HttpStatus.CONFLICT]: 'Conflict',
      [HttpStatus.UNPROCESSABLE_ENTITY]: 'Unprocessable Entity',
      [HttpStatus.TOO_MANY_REQUESTS]: 'Too Many Requests',
      [HttpStatus.BAD_GATEWAY]: 'Bad Gateway',
      [HttpStatus.SERVICE_UNAVAILABLE]: 'Service Unavailable',
      [HttpStatus.GATEWAY_TIMEOUT]: 'Gateway Timeout',
    };
    return errors[status] || 'Error';
  }
}
