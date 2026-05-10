import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ReceptionInfrastructureService } from '../infrastructure/reception.service';

@Injectable()
export class ReceptionService {
  constructor(private readonly infrastructure: ReceptionInfrastructureService) {}

  healthCheck(token: string): Observable<any> {
    return this.infrastructure.proxyRequest('GET', '/api', null, {
      Authorization: `Bearer ${token}`,
    });
  }

  list(token: string): Observable<any> {
    return this.infrastructure.proxyRequest('GET', '/reception', null, {
      Authorization: `Bearer ${token}`,
    });
  }

  getById(id: string, token: string): Observable<any> {
    return this.infrastructure.proxyRequest('GET', `/reception/${id}`, null, {
      Authorization: `Bearer ${token}`,
    });
  }

  create(data: any, token: string): Observable<any> {
    return this.infrastructure.proxyRequest('POST', '/reception', data, {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  update(id: string, data: any, token: string): Observable<any> {
    return this.infrastructure.proxyRequest('PUT', `/reception/${id}`, data, {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  delete(id: string, token: string): Observable<any> {
    return this.infrastructure.proxyRequest('DELETE', `/reception/${id}`, null, {
      Authorization: `Bearer ${token}`,
    });
  }
}
