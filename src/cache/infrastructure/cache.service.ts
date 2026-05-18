import { Injectable, HttpException, HttpStatus, Inject, Optional } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Observable, of, map, catchError, switchMap, tap } from 'rxjs';
import { AxiosResponse, AxiosError } from 'axios';

@Injectable()
export class CacheInfrastructureService {
  private readonly baseUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.baseUrl = this.configService.get<string>('AUTH_SERVICE_BASE_URL') || '';
    if (!this.baseUrl) {
      throw new Error('AUTH_SERVICE_BASE_URL is not defined');
    }
  }

  private proxyRequest(method: string, path: string, data?: any, headers?: any): Observable<any> {
    const url = `${this.baseUrl}${path}`;
    return this.httpService.request({ method, url, data, headers }).pipe(
      map((response: AxiosResponse) => response.data),
      catchError((error: AxiosError) => {
        if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
          throw new HttpException(
            `Servicio de cache no disponible en ${this.baseUrl}`,
            HttpStatus.BAD_GATEWAY,
          );
        }
        const rawData = error.response?.data;
        const isHtml = typeof rawData === 'string' && rawData.trim().startsWith('<!');
        const message = isHtml
          ? `Error interno del servicio de cache (${error.response?.status || 500})`
          : (rawData || `Service error: ${error.message}`);
        throw new HttpException(message, error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR);
      }),
    );
  }

  save(data: any, token: string): Observable<any> {
    return this.proxyRequest('POST', '/cache', data, {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  getByKey(key: string, token: string): Observable<any> {
    return this.proxyRequest('GET', `/cache/${key}`, null, { Authorization: `Bearer ${token}` });
  }

  deleteByKey(key: string, token: string): Observable<any> {
    return this.proxyRequest('DELETE', `/cache/${key}`, null, { Authorization: `Bearer ${token}` });
  }

  getOrFetch<T>(key: string, token: string, fetchFn: () => Observable<T>, ttlSeconds: number): Observable<T> {
    return this.getByKey(key, token).pipe(
      switchMap((cached) => {
        if (cached && cached.value !== undefined && cached.value !== null) {
          return of(cached.value as T);
        }
        return this.fetchAndCache(key, token, fetchFn, ttlSeconds);
      }),
      catchError(() => this.fetchAndCache(key, token, fetchFn, ttlSeconds)),
    );
  }

  private fetchAndCache<T>(key: string, token: string, fetchFn: () => Observable<T>, ttlSeconds: number): Observable<T> {
    return fetchFn().pipe(
      tap((data) => {
        this.save({ key, value: data, ttlSeconds }, token).subscribe({
          error: () => {},
        });
      }),
    );
  }
}
