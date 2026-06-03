import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Observable, map, catchError } from 'rxjs';
import { AxiosResponse, AxiosError } from 'axios';

@Injectable()
export class TrackerInfrastructureService {
  private readonly baseUrl: string;
  private readonly apiKey: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.baseUrl = this.configService.get<string>('TRACKER_SERVICE_BASE_URL') || '';
    this.apiKey = process.env.API_KEY || '';
    if (!this.baseUrl) {
      throw new Error('TRACKER_SERVICE_BASE_URL is not defined');
    }
  }

  proxyRequest(method: string, path: string, data?: any, headers?: any): Observable<any> {
    const url = `${this.baseUrl}${path}`;
    const mergedHeaders = { 'x-api-key': this.apiKey, ...headers };
    return this.httpService.request({ method, url, data, headers: mergedHeaders }).pipe(
      map((response: AxiosResponse) => response.data),
      catchError((error: AxiosError) => {
        if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
          throw new HttpException(
            `Tracker service no disponible en ${this.baseUrl}`,
            HttpStatus.BAD_GATEWAY,
          );
        }
        throw new HttpException(
          error.response?.data || `Tracker service error: ${error.message}`,
          error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }),
    );
  }

  listClients(token: string): Observable<any> {
    return this.proxyRequest('GET', '/api/clientes', null, { Authorization: `Bearer ${token}` });
  }

  getClientById(clienteId: string, token: string): Observable<any> {
    return this.proxyRequest('GET', `/api/clientes/${clienteId}`, null, { Authorization: `Bearer ${token}` });
  }

  listVehiclesByClient(clienteId: string, token: string): Observable<any> {
    return this.proxyRequest('GET', `/api/clientes/${clienteId}/vehiculos`, null, { Authorization: `Bearer ${token}` });
  }

  listVehicles(token: string): Observable<any> {
    return this.proxyRequest('GET', '/api/vehiculos', null, { Authorization: `Bearer ${token}` });
  }

  getVehicleByPlate(placa: string, token: string): Observable<any> {
    return this.proxyRequest('GET', `/api/vehiculos/${placa}`, null, { Authorization: `Bearer ${token}` });
  }

  listPlanillasByVehicle(placa: string, token: string): Observable<any> {
    return this.proxyRequest('GET', `/api/vehiculos/${placa}/planillas`, null, { Authorization: `Bearer ${token}` });
  }

  listPlanillas(token: string): Observable<any> {
    return this.proxyRequest('GET', '/api/planillas', null, { Authorization: `Bearer ${token}` });
  }

  getPlanillaById(planillaId: string, token: string): Observable<any> {
    return this.proxyRequest('GET', `/api/planillas/${planillaId}`, null, { Authorization: `Bearer ${token}` });
  }

  getStats(token: string): Observable<any> {
    return this.proxyRequest('GET', '/api/stats', null, { Authorization: `Bearer ${token}` });
  }
}
