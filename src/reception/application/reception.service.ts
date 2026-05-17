import { Injectable, BadRequestException } from '@nestjs/common';
import { Observable, forkJoin, of, throwError } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs';
import { ReceptionInfrastructureService } from '../infrastructure/reception.service';
import { ClientsApplicationService } from '../../clients/application/clients.service';
import { VehicleService } from '../../vehicle/application/vehicle.service';
import { AuthApplicationService } from '../../auth/application/auth.service';
import { UploadFilesService } from '../../upload-files/application/upload-files.service';
import { InspectionItem } from './dtos/inspection-item.interface';
import { InspectionsResponse } from './dtos/inspections-response.interface';
import { CreateInspectionDto } from './dtos/create-inspection.dto';
import { UpdateInspectionDto } from './dtos/update-inspection.dto';
import { mapInspectionItem, mapInspectionsResponse } from './mappers/inspection.mapper';

@Injectable()
export class ReceptionService {
  constructor(
    private readonly infrastructure: ReceptionInfrastructureService,
    private readonly clientService: ClientsApplicationService,
    private readonly vehicleService: VehicleService,
    private readonly authService: AuthApplicationService,
    private readonly uploadFilesService: UploadFilesService,
  ) {}

  deleteInspectionById(id: string, token: string): Observable<any> {
    return this.infrastructure.proxyRequest('DELETE', `/api/inspections/${id}`, null, {
      Authorization: `Bearer ${token}`,
    });
  }

  createInspection(
    dto: CreateInspectionDto,
    signatureFile: Express.Multer.File | undefined,
    photoFile: Express.Multer.File,
    token: string,
  ): Observable<any> {
    const baseUrl = process.env.API_GATEWAY_BASE_URL || '';

    const signatureUpload$ = signatureFile
      ? this.uploadFilesService.uploadFile(signatureFile, token).pipe(
          map(res => `${baseUrl}/api/v1/storage/files/${res.file.id}`),
          catchError(() => of(null)),
        )
      : of(null);

    const photoUpload$ = this.uploadFilesService.uploadFile(photoFile, token).pipe(
      map(res => `${baseUrl}/api/v1/storage/files/${res.file.id}`),
      catchError(() => throwError(() => new BadRequestException('Error al subir la foto de recepción'))),
    );

    return forkJoin([signatureUpload$, photoUpload$]).pipe(
      switchMap(([signatureUrl, photoUrl]) => {
        const payload = {
          mileage: dto.mileage,
          client_id: dto.client_id,
          vehicle_id: dto.vehicle_id,
          vehicle_type: dto.vehicle_type,
          fuel_type: dto.fuel_type,
          fuel_certificate_number: dto.fuel_certificate_number,
          service_type: dto.service_type,
          operator_id: dto.operator_id,
          responsible_id: dto.operator_id,
          customer_id: dto.operator_id,
          customer_type: dto.customer_type,
          revision_type: dto.revision_type,
          tinted_windows: dto.tinted_windows,
          armored_vehicle: dto.armored_vehicle,
          brake_fluid_sight_glass: dto.brake_fluid_sight_glass,
          observations: dto.observations,
          signature_url: signatureUrl || dto.signature_url || '',
          photo_reception_url: photoUrl || dto.photo_reception_url || '',
          checklist: dto.checklist,
          axles: dto.axles,
          tires: dto.tires,
        };

        return this.infrastructure.proxyRequest('POST', '/api/inspections', payload, {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        });
      }),
    );
  }
  

  updateInspection(
    id: string,
    dto: UpdateInspectionDto,
    signatureFile: Express.Multer.File | undefined,
    photoFile: Express.Multer.File | undefined,
    token: string,
  ): Observable<any> {
    const baseUrl = process.env.API_GATEWAY_BASE_URL || '';

    const signatureUpload$ = signatureFile
      ? this.uploadFilesService.uploadFile(signatureFile, token).pipe(
          map(res => `${baseUrl}/api/v1/storage/files/${res.file.id}`),
          catchError(() => of(null)),
        )
      : of(null);

    const photoUpload$ = photoFile
      ? this.uploadFilesService.uploadFile(photoFile, token).pipe(
          map(res => `${baseUrl}/api/v1/storage/files/${res.file.id}`),
          catchError(() => of(null)),
        )
      : of(null);

    return forkJoin([signatureUpload$, photoUpload$]).pipe(
      switchMap(([signatureUrl, photoUrl]) => {
        const defined = (obj: Record<string, any>) =>
          Object.entries(obj)
            .filter(([_, v]) => v !== undefined)
            .reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {} as Record<string, any>);

        const payload = defined({
          mileage: dto.mileage,
          client_id: dto.client_id,
          vehicle_id: dto.vehicle_id,
          vehicle_type: dto.vehicle_type,
          fuel_type: dto.fuel_type,
          fuel_certificate_number: dto.fuel_certificate_number,
          service_type: dto.service_type,
          customer_type: dto.customer_type,
          revision_type: dto.revision_type,
          tinted_windows: dto.tinted_windows,
          armored_vehicle: dto.armored_vehicle,
          brake_fluid_sight_glass: dto.brake_fluid_sight_glass,
          observations: dto.observations,
          checklist: dto.checklist,
          axles: dto.axles,
          tires: dto.tires,
        });

        if (dto.operator_id !== undefined) {
          payload.operator_id = dto.operator_id;
          payload.responsible_id = dto.operator_id;
          payload.customer_id = dto.operator_id;
        }

        if (signatureUrl) {
          payload.signature_url = signatureUrl;
        } else if (dto.signature_url !== undefined) {
          payload.signature_url = dto.signature_url;
        }

        if (photoUrl) {
          payload.photo_reception_url = photoUrl;
        } else if (dto.photo_reception_url !== undefined) {
          payload.photo_reception_url = dto.photo_reception_url;
        }

        return this.infrastructure.proxyRequest('PATCH', `/api/inspections/${id}`, payload, {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        });
      }),
    );
  }

  healthCheck(token: string): Observable<any> {
    return this.infrastructure.proxyRequest('GET', '/api', null, {
      Authorization: `Bearer ${token}`,
    });
  }

  getInspectionById(id: string, token: string): Observable<InspectionItem> {
    return this.infrastructure.proxyRequest('GET', `/api/inspections/${id}`, null, {
      Authorization: `Bearer ${token}`,
    }).pipe(
      switchMap((response: any) => {
        const item = response?.data ?? response;

        const clientRequest = item.client_id
          ? this.clientService.getClientById(item.client_id, token).pipe(catchError(() => of(null)))
          : of(null);

        const vehicleRequest = item.vehicle_id
          ? this.vehicleService.getVehicleById(item.vehicle_id, token).pipe(catchError(() => of(null)))
          : of(null);

        const operatorId = item.operator_id || item.responsible_id || item.customer_id;
        const operatorRequest = operatorId
          ? this.authService.getUserById(operatorId, token).pipe(catchError(() => of(null)))
          : of(null);

        return forkJoin([clientRequest, vehicleRequest, operatorRequest]).pipe(
          map(([clientData, vehicleData, userData]) =>
            mapInspectionItem(item, clientData, vehicleData, userData),
          ),
        );
      }),
    );
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
        const operatorIds = [...new Set(
          items.flatMap(item => [item.operator_id, item.responsible_id, item.customer_id])
            .filter(Boolean),
        )] as string[];

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

        const operatorRequests = operatorIds.map(operatorId =>
          this.authService.getUserById(operatorId, token).pipe(
            catchError(() => of(null)),
            map(userData => ({ operatorId, userData })),
          ),
        );

        const allRequests = [...clientRequests, ...vehicleRequests, ...operatorRequests];

        if (!allRequests.length) {
          return of(mapInspectionsResponse(response, new Map()));
        }

        return forkJoin(allRequests).pipe(
          map((results: any[]) => {
            const clientResults = results.slice(0, clientRequests.length).filter(r => r?.clientId);
            const vehicleResults = results.slice(clientRequests.length, clientRequests.length + vehicleRequests.length).filter(r => r?.vehicleId);
            const operatorResults = results.slice(clientRequests.length + vehicleRequests.length).filter(r => r?.operatorId);
            const clientMap = new Map(clientResults.map(r => [r.clientId, r.clientData]));
            const vehicleMap = new Map(vehicleResults.map(r => [r.vehicleId, r.vehicleData]));
            const operatorMap = new Map(operatorResults.map(r => [r.operatorId, r.userData]));
            return mapInspectionsResponse(response, clientMap, vehicleMap, operatorMap);
          }),
        );
      }),
    );
  }
}
