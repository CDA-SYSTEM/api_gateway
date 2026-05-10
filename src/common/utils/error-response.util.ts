import { HttpException, HttpStatus, BadRequestException } from '@nestjs/common';

export function buildErrorResponse(exception: unknown, requestPath?: string) {
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
      error = (resp as any).error || getDefaultError(status);
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

  return {
    statusCode: status,
    message,
    error,
    data: null,
    timestamp: new Date().toISOString(),
    ...(requestPath ? { path: requestPath } : {}),
  };
}

function getDefaultError(status: number): string {
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
