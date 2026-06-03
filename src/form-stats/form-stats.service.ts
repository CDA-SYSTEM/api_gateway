import { Injectable } from '@nestjs/common';
import { Observable, forkJoin } from 'rxjs';
import { FormStatsInfrastructureService } from './form-stats-infrastructure.service';

@Injectable()
export class FormStatsService {
  constructor(private readonly formStatsInfrastructure: FormStatsInfrastructureService) {}

  getFullStats(token: string): Observable<any> {
    return forkJoin({
      inspectionStats: this.formStatsInfrastructure.proxyRequest(
        'GET', '/api/inspections/stats', null, { Authorization: `Bearer ${token}` },
      ),
      invoiceStats: this.formStatsInfrastructure.proxyRequest(
        'GET', '/api/invoices/stats', null, { Authorization: `Bearer ${token}` },
      ),
    });
  }

  getInspectionStats(token: string): Observable<any> {
    return this.formStatsInfrastructure.proxyRequest(
      'GET', '/api/inspections/stats', null, { Authorization: `Bearer ${token}` },
    );
  }

  getInvoiceStats(token: string): Observable<any> {
    return this.formStatsInfrastructure.proxyRequest(
      'GET', '/api/invoices/stats', null, { Authorization: `Bearer ${token}` },
    );
  }
}
