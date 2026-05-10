import { Injectable } from '@nestjs/common';
import { Observable, forkJoin, of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs';
import { ReceptionInfrastructureService } from '../infrastructure/reception.service';
import { ClientsApplicationService } from '../../clients/application/clients.service';

@Injectable()
export class ReceptionService {
  constructor(
    private readonly infrastructure: ReceptionInfrastructureService,
    private readonly clientService: ClientsApplicationService,
  ) {}

  healthCheck(token: string): Observable<any> {
    return this.infrastructure.proxyRequest('GET', '/api', null, {
      Authorization: `Bearer ${token}`,
    });
  }

  listInspections(
    token: string,
    includeDeleted?: string,
    inspectionNumber?: string,
    vehicleId?: string,
    page?: number,
    size?: number,
  ): Observable<any> {
    const params = new URLSearchParams();
    if (includeDeleted !== undefined) params.append('includeDeleted', includeDeleted);
    if (inspectionNumber) params.append('inspection_number', inspectionNumber);
    if (vehicleId) params.append('vehicle_id', vehicleId);
    if (page !== undefined) params.append('page', page.toString());
    if (size !== undefined) params.append('size', size.toString());
    const queryString = params.toString();
    const url = `/api/inspections${queryString ? '?' + queryString : ''}`;
    return this.infrastructure.proxyRequest('GET', url, null, {
      Authorization: `Bearer ${token}`,
    }).pipe(
      switchMap((response: any) => {
        const envelopeData = response?.data ?? response;
        const items: any[] = Array.isArray(envelopeData) ? envelopeData : (envelopeData?.data ?? []);
        const pagination = envelopeData?.total !== undefined
          ? { total: envelopeData.total, page: envelopeData.page, size: envelopeData.size, totalPages: envelopeData.totalPages }
          : undefined;

        if (!items.length) {
          return of(pagination ? { data: [], ...pagination } : []);
        }

        const clientIds = [...new Set(items.map(item => item.client_id).filter(Boolean))] as string[];

        if (!clientIds.length) {
          const enriched = items.map(item => ({ ...item, client: null }));
          return of(pagination ? { data: enriched, ...pagination } : enriched);
        }

        const clientRequests = clientIds.map(clientId =>
          this.clientService.getClientById(clientId, token).pipe(
            catchError(() => of(null)),
            map(clientData => ({ clientId, clientData })),
          ),
        );

        return forkJoin(clientRequests).pipe(
          map((clientResults) => {
            const clientMap = new Map(clientResults.map(r => [r.clientId, r.clientData]));
            const enrichedItems = items.map(item => ({
              ...item,
              client: clientMap.get(item.client_id) ?? null,
            }));
            return pagination ? { data: enrichedItems, ...pagination } : enrichedItems;
          }),
        );
      }),
    );
  }
}
