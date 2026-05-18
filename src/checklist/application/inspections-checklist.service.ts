import { Injectable } from '@nestjs/common';
import { Observable, forkJoin, of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs';
import { ChecklistInfrastructureService } from '../infrastructure/checklist.service';
import { ClientsApplicationService } from '../../clients/application/clients.service';
import { VehicleService } from '../../vehicle/application/vehicle.service';

@Injectable()
export class InspectionsChecklistService {
  constructor(
    private readonly infrastructure: ChecklistInfrastructureService,
    private readonly clientService: ClientsApplicationService,
    private readonly vehicleService: VehicleService,
  ) {}

  private enrichItem(item: any, token: string): Observable<any> {
    if (!item?.id) return of(item);

    const clientReq = item.client_id
      ? this.clientService.getClientById(String(item.client_id), token).pipe(catchError(() => of(null)))
      : of(null);

    const vehicleReq = item.vehicle_id
      ? this.vehicleService.getVehicleById(String(item.vehicle_id), token).pipe(catchError(() => of(null)))
      : of(null);

    return forkJoin([clientReq, vehicleReq]).pipe(
      map(([clientRaw, vehicleRaw]) => ({
        ...item,
        client: clientRaw?.data ?? clientRaw ?? null,
        vehicle: vehicleRaw?.data ?? vehicleRaw ?? null,
      })),
    );
  }

  private enrichList(items: any[], token: string): Observable<any[]> {
    if (!items.length) return of(items);

    const clientIds = [...new Set(items.map(i => i.client_id).filter(Boolean))] as string[];
    const vehicleIds = [...new Set(items.map(i => String(i.vehicle_id)).filter(Boolean))] as string[];

    const clientReqs = clientIds.map(id =>
      this.clientService.getClientById(id, token).pipe(
        catchError(() => of(null)),
        map(raw => ({ id, data: raw?.data ?? raw ?? null })),
      ),
    );

    const vehicleReqs = vehicleIds.map(id =>
      this.vehicleService.getVehicleById(id, token).pipe(
        catchError(() => of(null)),
        map(raw => ({ id, data: raw?.data ?? raw ?? null })),
      ),
    );

    const allReqs = [...clientReqs, ...vehicleReqs];
    if (!allReqs.length) return of(items);

    return forkJoin(allReqs).pipe(
      map((results: any[]) => {
        const numClients = clientReqs.length;
        const clientMap = new Map(
          results.slice(0, numClients).filter(r => r).map(r => [r.id, r.data]),
        );
        const vehicleMap = new Map(
          results.slice(numClients).filter(r => r).map(r => [r.id, r.data]),
        );

        return items.map(item => ({
          ...item,
          client: item.client_id ? clientMap.get(String(item.client_id)) ?? null : null,
          vehicle: item.vehicle_id ? vehicleMap.get(String(item.vehicle_id)) ?? null : null,
        }));
      }),
    );
  }

  private enrichResponse(response: any, token: string): Observable<any> {
    const rawData = response?.data;
    if (!rawData) return of(response);

    if (Array.isArray(rawData)) {
      return this.enrichList(rawData, token).pipe(
        map(enriched => ({ ...response, data: enriched })),
      );
    }

    return this.enrichItem(rawData, token).pipe(
      map(enriched => ({ ...response, data: enriched })),
    );
  }

  private enrichSafe(response: any, token: string): Observable<any> {
    return this.enrichResponse(response, token).pipe(
      catchError(() => of(response)),
    );
  }

  list(token: string): Observable<any> {
    return this.infrastructure.listInspections(token).pipe(
      switchMap(res => this.enrichSafe(res, token)),
    );
  }

  create(data: any, token: string): Observable<any> {
    return this.infrastructure.createInspection(data, token);
  }

  getById(id: string, token: string): Observable<any> {
    return this.infrastructure.getInspectionById(id, token).pipe(
      switchMap(res => this.enrichSafe(res, token)),
    );
  }

  update(id: string, data: any, token: string): Observable<any> {
    return this.infrastructure.updateInspection(id, data, token);
  }

  delete(id: string, token: string): Observable<any> {
    return this.infrastructure.deleteInspection(id, token);
  }

  getByPlate(plate: string, token: string): Observable<any> {
    return this.infrastructure.getInspectionsByPlate(plate, token).pipe(
      switchMap(res => this.enrichSafe(res, token)),
    );
  }

  getByDate(start: string, end: string, token: string): Observable<any> {
    return this.infrastructure.getInspectionsByDate(start, end, token).pipe(
      switchMap(res => this.enrichSafe(res, token)),
    );
  }

  getByStatus(status: string, token: string): Observable<any> {
    return this.infrastructure.getInspectionsByStatus(status, token).pipe(
      switchMap(res => this.enrichSafe(res, token)),
    );
  }

  getByVehicle(vehicleId: string, token: string): Observable<any> {
    return this.infrastructure.getInspectionsByVehicle(vehicleId, token).pipe(
      switchMap(res => this.enrichSafe(res, token)),
    );
  }

  search(params: Record<string, any>, token: string): Observable<any> {
    return this.infrastructure.search(params, token).pipe(
      switchMap(res => this.enrichSafe(res, token)),
    );
  }

  saveDraft(id: string, data: any, token: string): Observable<any> {
    return this.infrastructure.saveDraft(id, data, token);
  }

  markInProgress(id: string, data: any, token: string): Observable<any> {
    return this.infrastructure.markInProgress(id, data, token);
  }

  close(id: string, data: any, token: string): Observable<any> {
    return this.infrastructure.closeInspection(id, data, token);
  }
}
