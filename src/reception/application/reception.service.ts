import { Injectable } from '@nestjs/common';
import { Observable, forkJoin, of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs';
import { ReceptionInfrastructureService } from '../infrastructure/reception.service';
import { ClientsApplicationService } from '../../clients/application/clients.service';
import { VehicleService } from '../../vehicle/application/vehicle.service';
import { InspectionsResponse } from './dtos/inspections-response.interface';
import { mapInspectionsResponse } from './mappers/inspection.mapper';

@Injectable()
export class ReceptionService {
  constructor(
    private readonly infrastructure: ReceptionInfrastructureService,
    private readonly clientService: ClientsApplicationService,
    private readonly vehicleService: VehicleService,
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
  ): Observable<InspectionsResponse> {
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
        const items: any[] = Array.isArray(response?.data)
          ? response.data
          : (response?.data?.data ?? []);

        const clientIds = [...new Set(items.map(item => item.client_id).filter(Boolean))] as string[];
        const vehicleIds = [...new Set(items.map(item => item.vehicle_id).filter(Boolean))] as string[];

        const clientRequests = clientIds.map(clientId =>
          this.clientService.getClientById(clientId, token).pipe(
            catchError(() => of(null)),
            map(clientData => ({ clientId, clientData })),
          ),
        );

        const vehicleRequests = vehicleIds.map(vehicleId =>
          this.vehicleService.getVehicleById(vehicleId, token).pipe(
            catchError(() => of(null)),
            map(vehicleData => ({ vehicleId, vehicleData })),
          ),
        );

        const allRequests = [...clientRequests, ...vehicleRequests];

        if (!allRequests.length) {
          return of(mapInspectionsResponse(response, new Map()));
        }

        return forkJoin(allRequests).pipe(
          map((results: any[]) => {
            const clientResults = results.slice(0, clientRequests.length).filter(r => r?.clientId);
            const vehicleResults = results.slice(clientRequests.length).filter(r => r?.vehicleId);
            const clientMap = new Map(clientResults.map(r => [r.clientId, r.clientData]));
            const vehicleMap = new Map(vehicleResults.map(r => [r.vehicleId, r.vehicleData]));
            return mapInspectionsResponse(response, clientMap, vehicleMap);
          }),
        );
      }),
    );
  }
}
