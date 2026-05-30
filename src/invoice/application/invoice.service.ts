import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { InvoiceInfrastructureService } from '../infrastructure/invoice.service';

@Injectable()
export class InvoiceService {
  constructor(private readonly infrastructure: InvoiceInfrastructureService) {}

  create(data: any, token: string): Observable<any> {
    return this.infrastructure.proxyRequest('POST', '/api/invoices', data, {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  findAll(
    token: string,
    invoiceNumber?: string,
    statusId?: string,
    inspectionId?: string,
    includeDeleted?: string,
    page?: number,
    size?: number,
  ): Observable<any> {
    const params = new URLSearchParams();
    if (invoiceNumber) params.append('invoice_number', invoiceNumber);
    if (statusId) params.append('statusId', statusId);
    if (inspectionId) params.append('inspection_id', inspectionId);
    if (includeDeleted) params.append('includeDeleted', includeDeleted);
    if (page !== undefined) params.append('page', page.toString());
    if (size !== undefined) params.append('size', size.toString());
    const qs = params.toString();
    return this.infrastructure.proxyRequest('GET', `/api/invoices${qs ? '?' + qs : ''}`, null, {
      Authorization: `Bearer ${token}`,
    });
  }

  findOne(id: string, token: string): Observable<any> {
    return this.infrastructure.proxyRequest('GET', `/api/invoices/${id}`, null, {
      Authorization: `Bearer ${token}`,
    });
  }

  update(id: string, data: any, token: string): Observable<any> {
    return this.infrastructure.proxyRequest('PATCH', `/api/invoices/${id}`, data, {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  remove(id: string, token: string): Observable<any> {
    return this.infrastructure.proxyRequest('DELETE', `/api/invoices/${id}`, null, {
      Authorization: `Bearer ${token}`,
    });
  }
}
