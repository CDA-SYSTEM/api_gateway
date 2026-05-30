import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { PriceInfrastructureService } from '../infrastructure/price.service';

@Injectable()
export class PriceService {
  constructor(private readonly infrastructure: PriceInfrastructureService) {}

  create(data: any, token: string): Observable<any> {
    return this.infrastructure.proxyRequest('POST', '/api/prices', data, {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  findAll(token: string, vehicleType?: string, revisionType?: string): Observable<any> {
    const params = new URLSearchParams();
    if (vehicleType) params.append('vehicleType', vehicleType);
    if (revisionType) params.append('revisionType', revisionType);
    const qs = params.toString();
    return this.infrastructure.proxyRequest('GET', `/api/prices${qs ? '?' + qs : ''}`, null, {
      Authorization: `Bearer ${token}`,
    });
  }

  findOne(id: string, token: string): Observable<any> {
    return this.infrastructure.proxyRequest('GET', `/api/prices/${id}`, null, {
      Authorization: `Bearer ${token}`,
    });
  }

  update(id: string, data: any, token: string): Observable<any> {
    return this.infrastructure.proxyRequest('PATCH', `/api/prices/${id}`, data, {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  remove(id: string, token: string): Observable<any> {
    return this.infrastructure.proxyRequest('DELETE', `/api/prices/${id}`, null, {
      Authorization: `Bearer ${token}`,
    });
  }
}
