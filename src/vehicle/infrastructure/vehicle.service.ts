import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Observable, map, catchError } from 'rxjs';
import { AxiosResponse, AxiosError } from 'axios';
import { safeParse } from '../../common/utils/parse.util';

@Injectable()
export class VehicleInfrastructureService {
  private readonly baseUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.baseUrl = this.configService.get<string>('VEHICLE_SERVICE_BASE_URL') || '';
    if (!this.baseUrl) {
      throw new Error('VEHICLE_SERVICE_BASE_URL is not defined');
    }
  }

  proxyRequest(method: string, path: string, data?: any, headers?: any): Observable<any> {
    const url = `${this.baseUrl}${path}`;
    
    console.log(`Proxying ${method} request to: ${url}`);
    
    return this.httpService.request({
      method,
      url,
      data,
      headers,
    }).pipe(
      map((response: AxiosResponse) => safeParse(response.data)),
      catchError((error: AxiosError) => {
        console.error('Proxy error:', {
          url,
          method,
          message: error.message,
          code: error.code,
          response: error.response?.data,
        });
        
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
