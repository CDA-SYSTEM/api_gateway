import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { StatusInfrastructureService } from '../infrastructure/status.service';

@Injectable()
export class StatusService {
  constructor(private readonly infrastructure: StatusInfrastructureService) {}

  create(data: any, token: string): Observable<any> {
    return this.infrastructure.proxyRequest('POST', '/api/statuses', data, {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  findAll(token: string, code?: string, page?: number, size?: number): Observable<any> {
    const params = new URLSearchParams();
    if (code) params.append('code', code);
    if (page) params.append('page', page.toString());
    if (size) params.append('size', size.toString());
    const qs = params.toString();
    return this.infrastructure.proxyRequest('GET', `/api/statuses${qs ? '?' + qs : ''}`, null, {
      Authorization: `Bearer ${token}`,
    });
  }

  findOne(id: string, token: string): Observable<any> {
    return this.infrastructure.proxyRequest('GET', `/api/statuses/${id}`, null, {
      Authorization: `Bearer ${token}`,
    });
  }

  update(id: string, data: any, token: string): Observable<any> {
    return this.infrastructure.proxyRequest('PATCH', `/api/statuses/${id}`, data, {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  remove(id: string, token: string): Observable<any> {
    return this.infrastructure.proxyRequest('DELETE', `/api/statuses/${id}`, null, {
      Authorization: `Bearer ${token}`,
    });
  }
}
