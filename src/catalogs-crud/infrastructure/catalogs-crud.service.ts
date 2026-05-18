import { Injectable, HttpException, HttpStatus, BadRequestException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Observable, map, catchError } from 'rxjs';
import { AxiosResponse, AxiosError } from 'axios';
import { CacheInfrastructureService } from '../../cache/infrastructure/cache.service';
import { CACHE_KEYS, CACHE_TTL } from '../../cache/application/cache-keys.constant';

const VALID_TYPES = [
  'marcas', 'clases', 'lineas', 'colores',
  'tipos-vehiculo', 'tipos-combustible', 'tipos-servicio',
] as const;

const TYPE_MAP: Record<string, string> = {
  marcas: 'marca',
  clases: 'clase',
  lineas: 'linea',
  colores: 'color',
  'tipos-vehiculo': 'tipo-vehiculo',
  'tipos-combustible': 'tipo-combustible',
  'tipos-servicio': 'tipo-servicio',
};

@Injectable()
export class CatalogsCrudInfrastructureService {
  private readonly baseUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly cacheService: CacheInfrastructureService,
  ) {
    this.baseUrl = this.configService.get<string>('VEHICLE_SERVICE_BASE_URL') || '';
    if (!this.baseUrl) {
      throw new Error('VEHICLE_SERVICE_BASE_URL is not defined');
    }
  }

  validateType(type: string): string {
    const mapped = TYPE_MAP[type];
    if (!mapped) {
      throw new BadRequestException(
        `Tipo de catálogo inválido: ${type}. Válidos: ${VALID_TYPES.join(', ')}`,
      );
    }
    return mapped;
  }

  list(type: string, token: string): Observable<any> {
    const mapped = this.validateType(type);
    return this.cacheService.getOrFetch(CACHE_KEYS.CATALOGS_CRUD.LIST(type), token, () =>
      this.proxyRequest('GET', `/${mapped}`, null, { Authorization: `Bearer ${token}` }),
      CACHE_TTL.EXTRA_LONG,
    );
  }

  create(type: string, data: any, token: string): Observable<any> {
    const mapped = this.validateType(type);
    return this.proxyRequest('POST', `/${mapped}`, data, {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  getById(type: string, id: string, token: string): Observable<any> {
    const mapped = this.validateType(type);
    return this.cacheService.getOrFetch(CACHE_KEYS.CATALOGS_CRUD.BY_ID(type, id), token, () =>
      this.proxyRequest('GET', `/${mapped}/${id}`, null, { Authorization: `Bearer ${token}` }),
      CACHE_TTL.EXTRA_LONG,
    );
  }

  update(type: string, id: string, data: any, token: string): Observable<any> {
    const mapped = this.validateType(type);
    return this.proxyRequest('PUT', `/${mapped}/${id}`, data, {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  delete(type: string, id: string, token: string): Observable<any> {
    const mapped = this.validateType(type);
    return this.proxyRequest('DELETE', `/${mapped}/${id}`, null, {
      Authorization: `Bearer ${token}`,
    });
  }

  private proxyRequest(method: string, path: string, data?: any, headers?: any): Observable<any> {
    const url = `${this.baseUrl}${path}`;
    return this.httpService.request({ method, url, data, headers }).pipe(
      map((response: AxiosResponse) => response.data),
      catchError((error: AxiosError) => {
        if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
          throw new HttpException(
            `Vehicle service no disponible en ${this.baseUrl}`,
            HttpStatus.BAD_GATEWAY,
          );
        }
        throw new HttpException(
          error.response?.data || `Service error: ${error.message}`,
          error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }),
    );
  }
}
