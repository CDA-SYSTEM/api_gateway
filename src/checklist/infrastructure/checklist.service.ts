import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Observable, map, catchError } from 'rxjs';
import { AxiosResponse, AxiosError } from 'axios';
import { CacheInfrastructureService } from '../../cache/infrastructure/cache.service';
import { CACHE_KEYS, CACHE_TTL } from '../../cache/application/cache-keys.constant';

@Injectable()
export class ChecklistInfrastructureService {
  private readonly baseUrl: string;
  private readonly apiKey: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly cacheService: CacheInfrastructureService,
  ) {
    this.baseUrl = this.configService.get<string>('CHECKLIST_SERVICE_BASE_URL') || '';
    this.apiKey = process.env.API_KEY || '';
    if (!this.baseUrl) {
      throw new Error('CHECKLIST_SERVICE_BASE_URL is not defined');
    }
  }

  private proxyRequest(method: string, path: string, data?: any, headers?: any): Observable<any> {
    const url = `${this.baseUrl}${path}`;
    const mergedHeaders = { 'x-api-key': this.apiKey, ...headers };
    return this.httpService.request({ method, url, data, headers: mergedHeaders }).pipe(
      map((response: AxiosResponse) => response.data),
      catchError((error: AxiosError) => {
        if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
          throw new HttpException(
            `Checklist service no disponible en ${this.baseUrl}`,
            HttpStatus.BAD_GATEWAY,
          );
        }
        const rawData = error.response?.data;
        const isHtml = typeof rawData === 'string' && rawData.trim().startsWith('<!');
        const message = isHtml
          ? `Error interno del checklist-service (${error.response?.status || 500})`
          : (rawData || `Service error: ${error.message}`);
        throw new HttpException(message, error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR);
      }),
    );
  }

  listTemplates(vehicleType: string | undefined, token: string): Observable<any> {
    const path = vehicleType ? `/templates?vehicle_type=${vehicleType}` : '/templates';
    const key = CACHE_KEYS.CHECKLIST.TEMPLATES(vehicleType);
    return this.cacheService.getOrFetch(key, token, () =>
      this.proxyRequest('GET', path, null, { Authorization: `Bearer ${token}` }),
      CACHE_TTL.MEDIUM,
    );
  }

  createTemplate(data: any, token: string): Observable<any> {
    return this.proxyRequest('POST', '/templates', data, {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  getActiveMotoTemplate(token: string): Observable<any> {
    return this.cacheService.getOrFetch(CACHE_KEYS.CHECKLIST.TEMPLATE_MOTO_ACTIVE, token, () =>
      this.proxyRequest('GET', '/templates/motos', null, { Authorization: `Bearer ${token}` }),
      CACHE_TTL.MEDIUM,
    );
  }

  getActiveLivianosPesadosTemplate(token: string): Observable<any> {
    return this.cacheService.getOrFetch(CACHE_KEYS.CHECKLIST.TEMPLATE_LIVIANOS_PESADOS_ACTIVE, token, () =>
      this.proxyRequest('GET', '/templates/livianos-pesados', null, { Authorization: `Bearer ${token}` }),
      CACHE_TTL.MEDIUM,
    );
  }

  getActiveTemplateByVehicleType(vehicleType: string, token: string): Observable<any> {
    return this.cacheService.getOrFetch(CACHE_KEYS.CHECKLIST.TEMPLATE_ACTIVE_BY_TYPE(vehicleType), token, () =>
      this.proxyRequest('GET', `/templates/active/${vehicleType}`, null, { Authorization: `Bearer ${token}` }),
      CACHE_TTL.MEDIUM,
    );
  }

  getTemplateById(id: string, token: string): Observable<any> {
    return this.cacheService.getOrFetch(CACHE_KEYS.CHECKLIST.TEMPLATE_BY_ID(id), token, () =>
      this.proxyRequest('GET', `/templates/${id}`, null, { Authorization: `Bearer ${token}` }),
      CACHE_TTL.MEDIUM,
    );
  }

  updateTemplate(id: string, data: any, token: string): Observable<any> {
    return this.proxyRequest('PUT', `/templates/${id}`, data, {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  deleteTemplate(id: string, token: string): Observable<any> {
    return this.proxyRequest('DELETE', `/templates/${id}`, null, { Authorization: `Bearer ${token}` });
  }

  listInspections(token: string): Observable<any> {
    return this.cacheService.getOrFetch(CACHE_KEYS.CHECKLIST.INSPECTIONS, token, () =>
      this.proxyRequest('GET', '/inspections', null, { Authorization: `Bearer ${token}` }),
      CACHE_TTL.SHORT,
    );
  }

  createInspection(data: any, token: string): Observable<any> {
    return this.proxyRequest('POST', '/inspections', data, {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  getInspectionById(id: string, token: string): Observable<any> {
    return this.cacheService.getOrFetch(CACHE_KEYS.CHECKLIST.INSPECTION_BY_ID(id), token, () =>
      this.proxyRequest('GET', `/inspections/${id}`, null, { Authorization: `Bearer ${token}` }),
      CACHE_TTL.SHORT,
    );
  }

  updateInspection(id: string, data: any, token: string): Observable<any> {
    return this.proxyRequest('PUT', `/inspections/${id}`, data, {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  deleteInspection(id: string, token: string): Observable<any> {
    return this.proxyRequest('DELETE', `/inspections/${id}`, null, { Authorization: `Bearer ${token}` });
  }

  getInspectionsByPlate(plate: string, token: string): Observable<any> {
    return this.cacheService.getOrFetch(CACHE_KEYS.CHECKLIST.INSPECTIONS_BY_PLATE(plate), token, () =>
      this.proxyRequest('GET', `/inspections/by-plate/${plate}`, null, { Authorization: `Bearer ${token}` }),
      CACHE_TTL.SHORT,
    );
  }

  getInspectionsByDate(start: string, end: string, token: string): Observable<any> {
    return this.cacheService.getOrFetch(CACHE_KEYS.CHECKLIST.INSPECTIONS_BY_DATE(start, end), token, () =>
      this.proxyRequest('GET', `/inspections/by-date?start=${start}&end=${end}`, null, { Authorization: `Bearer ${token}` }),
      CACHE_TTL.SHORT,
    );
  }

  getInspectionsByStatus(status: string, token: string): Observable<any> {
    return this.cacheService.getOrFetch(CACHE_KEYS.CHECKLIST.INSPECTIONS_BY_STATUS(status), token, () =>
      this.proxyRequest('GET', `/inspections/by-status/${status}`, null, { Authorization: `Bearer ${token}` }),
      CACHE_TTL.SHORT,
    );
  }

  getInspectionsByVehicle(vehicleId: string, token: string): Observable<any> {
    return this.cacheService.getOrFetch(CACHE_KEYS.CHECKLIST.INSPECTIONS_BY_VEHICLE(vehicleId), token, () =>
      this.proxyRequest('GET', `/inspections/by-vehicle/${vehicleId}`, null, { Authorization: `Bearer ${token}` }),
      CACHE_TTL.SHORT,
    );
  }

  search(params: Record<string, any>, token: string): Observable<any> {
    const query = new URLSearchParams();
    const paramMap: Record<string, string> = {
      page: 'page',
      page_size: 'page_size',
      plate: 'plate',
      status: 'status',
      vehicle_id: 'vehicle_id',
      start_date: 'start_date',
      end_date: 'end_date',
    };
    for (const [key, param] of Object.entries(paramMap)) {
      const val = params[key];
      if (val !== undefined && val !== null) {
        query.append(param, String(val));
      }
    }
    const qs = query.toString();
    const path = `/inspections/search${qs ? '?' + qs : ''}`;
    return this.cacheService.getOrFetch(CACHE_KEYS.CHECKLIST.INSPECTIONS_SEARCH(qs), token, () =>
      this.proxyRequest('GET', path, null, { Authorization: `Bearer ${token}` }),
      CACHE_TTL.SHORT,
    );
  }

  saveDraft(id: string, data: any, token: string): Observable<any> {
    return this.proxyRequest('PATCH', `/inspections/${id}/draft`, data, {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  markInProgress(id: string, data: any, token: string): Observable<any> {
    return this.proxyRequest('PATCH', `/inspections/${id}/in-progress`, data, {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  closeInspection(id: string, data: any, token: string): Observable<any> {
    return this.proxyRequest('PATCH', `/inspections/${id}/close`, data, {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  createLabrado(data: any, token: string): Observable<any> {
    return this.proxyRequest('POST', '/labrado', data, {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  getLabradoByInspection(inspectionId: string, token: string): Observable<any> {
    return this.cacheService.getOrFetch(CACHE_KEYS.CHECKLIST.LABRADO_BY_INSPECTION(inspectionId), token, () =>
      this.proxyRequest('GET', `/labrado/by-inspection/${inspectionId}`, null, { Authorization: `Bearer ${token}` }),
      CACHE_TTL.SHORT,
    );
  }

  updateLabradoByInspection(inspectionId: string, data: any, token: string): Observable<any> {
    return this.proxyRequest('PUT', `/labrado/by-inspection/${inspectionId}`, data, {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }
}
