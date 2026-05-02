import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Observable, map, catchError } from 'rxjs';
import { AxiosResponse, AxiosError } from 'axios';

@Injectable()
export class TokenValidationService {
  private readonly authServiceBaseUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.authServiceBaseUrl = this.configService.get<string>('AUTH_SERVICE_BASE_URL') || '';
    if (!this.authServiceBaseUrl) {
      throw new Error('AUTH_SERVICE_BASE_URL is not defined');
    }
  }

  validateToken(token: string): Observable<{ valid: boolean; roles: string[]; userId: string }> {
    return this.httpService.post(`${this.authServiceBaseUrl}/auth/validate-token`, { token }).pipe(
      map((response: AxiosResponse<{ valid: boolean; roles: string[]; userId: string }>) => response.data),
      catchError((error: AxiosError) => {
        if (error.response?.status === 401) {
          throw new HttpException(
            error.response.data || 'Token inválido o expirado',
            HttpStatus.UNAUTHORIZED,
          );
        }
        throw new HttpException(
          'Error validando token',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }),
    );
  }
}
