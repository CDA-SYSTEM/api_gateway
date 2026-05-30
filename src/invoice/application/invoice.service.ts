import { Injectable, Logger } from '@nestjs/common';
import { Observable, forkJoin, of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs';
import { InvoiceInfrastructureService } from '../infrastructure/invoice.service';
import { StatusService } from '../../status/application/status.service';
import { InvoicePaidHandler } from './invoice-paid.handler';

@Injectable()
export class InvoiceService {
  private readonly logger = new Logger(InvoiceService.name);

  constructor(
    private readonly infrastructure: InvoiceInfrastructureService,
    private readonly statusService: StatusService,
    private readonly invoicePaidHandler: InvoicePaidHandler,
  ) {}

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
    const incomingStatusId = data?.statusId;

    if (!incomingStatusId) {
      return this.infrastructure.proxyRequest('PATCH', `/api/invoices/${id}`, data, {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      });
    }

    return forkJoin({
      update: this.infrastructure.proxyRequest('PATCH', `/api/invoices/${id}`, data, {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      }),
      paidStatus: this.statusService.findAll(token, 'PAID').pipe(
        map((res) => {
          const list = Array.isArray(res?.data) ? res.data : (res?.data?.data ?? []);
          return list?.[0]?.id ?? null;
        }),
      ),
    }).pipe(
      map(({ update, paidStatus }) => {
        if (paidStatus && incomingStatusId === paidStatus) {
          this.logger.log(`[Invoice] Invoice ${id} updated to PAID, triggering checklist creation`);
          this.invoicePaidHandler.handle(id, token);
        }
        return update;
      }),
      catchError((err) => {
        this.logger.error(`[Invoice] Update failed for ${id}: ${err.message}`);
        return this.infrastructure.proxyRequest('PATCH', `/api/invoices/${id}`, data, {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        });
      }),
    );
  }

  remove(id: string, token: string): Observable<any> {
    return this.infrastructure.proxyRequest('DELETE', `/api/invoices/${id}`, null, {
      Authorization: `Bearer ${token}`,
    });
  }
}
