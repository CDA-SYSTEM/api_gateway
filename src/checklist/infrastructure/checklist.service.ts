import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Observable, map, catchError } from 'rxjs';
import { AxiosResponse, AxiosError } from 'axios';

@Injectable()
export class ChecklistInfrastructureService {
  private readonly baseUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.baseUrl = this.configService.get<string>('CHECKLIST_SERVICE_BASE_URL') || '';
    if (!this.baseUrl) {
      throw new Error('CHECKLIST_SERVICE_BASE_URL is not defined');
    }
  }

  private proxyRequest(method: string, path: string, data?: any, headers?: any): Observable<any> {
    const url = `${this.baseUrl}${path}`;
    return this.httpService.request({ method, url, data, headers }).pipe(
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
    return this.proxyRequest('GET', path, null, { Authorization: `Bearer ${token}` });
  }

  createTemplate(data: any, token: string): Observable<any> {
    return this.proxyRequest('POST', '/templates', data, {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  getActiveMotoTemplate(token: string): Observable<any> {
    return this.proxyRequest('GET', '/templates/motos', null, { Authorization: `Bearer ${token}` });
  }

  getActiveLivianosPesadosTemplate(token: string): Observable<any> {
    return this.proxyRequest('GET', '/templates/livianos-pesados', null, { Authorization: `Bearer ${token}` });
  }

  getActiveTemplateByVehicleType(vehicleType: string, token: string): Observable<any> {
    return this.proxyRequest('GET', `/templates/active/${vehicleType}`, null, { Authorization: `Bearer ${token}` });
  }

  getTemplateById(id: string, token: string): Observable<any> {
    return this.proxyRequest('GET', `/templates/${id}`, null, { Authorization: `Bearer ${token}` });
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
    return this.proxyRequest('GET', '/inspections', null, { Authorization: `Bearer ${token}` });
  }

  createInspection(data: any, token: string): Observable<any> {
    return this.proxyRequest('POST', '/inspections', data, {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  getInspectionById(id: string, token: string): Observable<any> {
    return this.proxyRequest('GET', `/inspections/${id}`, null, { Authorization: `Bearer ${token}` });
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
    return this.proxyRequest('GET', `/inspections/by-plate/${plate}`, null, { Authorization: `Bearer ${token}` });
  }

  getInspectionsByDate(start: string, end: string, token: string): Observable<any> {
    return this.proxyRequest('GET', `/inspections/by-date?start=${start}&end=${end}`, null, { Authorization: `Bearer ${token}` });
  }

  getInspectionsByStatus(status: string, token: string): Observable<any> {
    return this.proxyRequest('GET', `/inspections/by-status/${status}`, null, { Authorization: `Bearer ${token}` });
  }

  getInspectionsByVehicle(vehicleId: string, token: string): Observable<any> {
    return this.proxyRequest('GET', `/inspections/by-vehicle/${vehicleId}`, null, { Authorization: `Bearer ${token}` });
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
    return this.proxyRequest('GET', `/labrado/by-inspection/${inspectionId}`, null, { Authorization: `Bearer ${token}` });
  }

  updateLabradoByInspection(inspectionId: string, data: any, token: string): Observable<any> {
    return this.proxyRequest('PUT', `/labrado/by-inspection/${inspectionId}`, data, {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }
}
