import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { Observable, forkJoin, of, throwError } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs';
import { ReceptionInfrastructureService } from '../infrastructure/reception.service';
import { ClientsApplicationService } from '../../clients/application/clients.service';
import { VehicleService } from '../../vehicle/application/vehicle.service';
import { AuthApplicationService } from '../../auth/application/auth.service';
import { UploadFilesService } from '../../upload-files/application/upload-files.service';
import { TemplatesChecklistService } from '../../checklist/application/templates-checklist.service';
import { ChecklistInfrastructureService } from '../../checklist/infrastructure/checklist.service';
import { PriceService } from '../../price/application/price.service';
import { StatusService } from '../../status/application/status.service';
import { InvoiceService } from '../../invoice/application/invoice.service';
import { InspectionItem } from './dtos/inspection-item.interface';
import { InspectionsResponse } from './dtos/inspections-response.interface';
import { CreateInspectionDto } from './dtos/create-inspection.dto';
import { UpdateInspectionDto } from './dtos/update-inspection.dto';
import { mapInspectionItem, mapInspectionsResponse } from './mappers/inspection.mapper';

@Injectable()
export class ReceptionService {
  private readonly logger = new Logger(ReceptionService.name);
  constructor(
    private readonly infrastructure: ReceptionInfrastructureService,
    private readonly clientService: ClientsApplicationService,
    private readonly vehicleService: VehicleService,
    private readonly authService: AuthApplicationService,
    private readonly uploadFilesService: UploadFilesService,
    private readonly checklistTemplateService: TemplatesChecklistService,
    private readonly checklistInfrastructure: ChecklistInfrastructureService,
    private readonly priceService: PriceService,
    private readonly statusService: StatusService,
    private readonly invoiceService: InvoiceService,
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
          checklistId: dto.checklistId,
          checklist: dto.checklist,
          axles: dto.axles,
          tires: dto.tires,
        };

        return this.infrastructure.proxyRequest('POST', '/api/inspections', payload, {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        }).pipe(
          switchMap((created) => {
            this.logger.log('[DEBUG] POST /api/inspections response:', JSON.stringify(created));
            const inspectionData = created?.data ?? created;
            const inspectionId = inspectionData?.id;
            const vehicleId = dto.vehicle_id;
            this.logger.log('[DEBUG] inspectionId:', inspectionId, 'vehicleId:', vehicleId);

            const checklist$ = this.createChecklistForInspection(dto, inspectionId, vehicleId, token, created).pipe(
              catchError((err) => {
                this.logger.error(`Checklist creation failed: ${err.message}`);
                return of(created);
              }),
            );

            const invoice$ = inspectionId
              ? this.autoCreateInvoice(dto, inspectionId, token).pipe(
                  catchError((err) => {
                    this.logger.error(`Invoice auto-creation failed: ${err.message}`);
                    return of(null);
                  }),
                  map((invoiceResult) => {
                    if (invoiceResult) {
                      const invoiceId = invoiceResult?.id ?? invoiceResult?.data?.id;
                      return { ...created, invoiceId };
                    }
                    return created;
                  }),
                )
              : of(created);

            return forkJoin([checklist$, invoice$]).pipe(
              map(([checklistResult, invoiceResult]) => invoiceResult ?? checklistResult),
            );
          }),
        );
      }),
    );
  }

  private createChecklistForInspection(
    dto: CreateInspectionDto,
    inspectionId: string | undefined,
    vehicleId: string | undefined,
    token: string,
    created: any,
  ): Observable<any> {
    if (!vehicleId || !inspectionId) {
      this.logger.log('[DEBUG] SKIP checklist — missing vehicleId or inspectionId');
      return of(created);
    }

    this.logger.log('[DEBUG] Fetching vehicle + templates in parallel...');
    return forkJoin({
      vehicle: this.vehicleService.getVehicleById(vehicleId, token).pipe(catchError((err) => { this.logger.log('[DEBUG] vehicle error:', err?.message); return of(null); })),
      motoTemplate: this.checklistTemplateService.getActiveMotoTemplate(token).pipe(catchError((err) => { this.logger.log('[DEBUG] motoTemplate error:', err?.message); return of(null); })),
      livianosTemplate: this.checklistTemplateService.getActiveLivianosPesadosTemplate(token).pipe(catchError((err) => { this.logger.log('[DEBUG] livianosTemplate error:', err?.message); return of(null); })),
    }).pipe(
      switchMap(({ vehicle, motoTemplate, livianosTemplate }) => {
        this.logger.log('[DEBUG] vehicle:', JSON.stringify(vehicle)?.slice(0, 300));
        this.logger.log('[DEBUG] motoTemplate:', JSON.stringify(motoTemplate)?.slice(0, 200));
        this.logger.log('[DEBUG] livianosTemplate:', JSON.stringify(livianosTemplate)?.slice(0, 200));

        const tipo = (vehicle?.tipoVehiculo?.nombre ?? vehicle?.data?.tipoVehiculo?.nombre ?? '').toLowerCase();
        const plate = vehicle?.placa ?? vehicle?.data?.placa ?? '';
        this.logger.log('[DEBUG] tipo:', tipo, 'plate:', plate);

        let vehicleType: string;
        let templateId: string;

        if (tipo === 'moto') {
          vehicleType = 'MOTO';
          templateId = motoTemplate?.id ?? motoTemplate?.data?.id ?? '';
        } else {
          vehicleType = tipo === 'pesado' ? 'PESADO' : 'LIVIANO';
          templateId = livianosTemplate?.id ?? livianosTemplate?.data?.id ?? '';
        }
        this.logger.log('[DEBUG] vehicleType:', vehicleType, 'templateId:', templateId);

        if (!templateId || !plate) {
          this.logger.log('[DEBUG] SKIP checklist — no templateId or plate');
          return of(created);
        }

        const checklistPayload = {
          plate,
          vehicle_id: Number(vehicleId),
          client_id: Number(dto.client_id),
          vehicle_type: vehicleType,
          template_id: templateId,
          inspection_datetime: new Date().toISOString(),
          inspector_id: dto.operator_id,
          observations: dto.observations ?? '',
        };
        this.logger.log('[DEBUG] Creating checklist inspection:', JSON.stringify(checklistPayload));

        return this.checklistInfrastructure.createInspection(checklistPayload, token).pipe(
          switchMap((checklistResult) => {
            this.logger.log('[DEBUG] checklist create response:', JSON.stringify(checklistResult)?.slice(0, 200));
            const checklistId = checklistResult?.id ?? checklistResult?.data?.id;
            if (!checklistId) {
              this.logger.log('[DEBUG] SKIP PATCH — no checklistId in response');
              return of(created);
            }

            this.logger.log('[DEBUG] PATCH checklistId:', checklistId, 'on inspection:', inspectionId);
            return this.infrastructure.proxyRequest('PATCH', `/api/inspections/${inspectionId}/checklist-id`, { checklistId }, {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            }).pipe(
              catchError((err) => {
                this.logger.log('[DEBUG] PATCH error:', err?.message);
                return of(created);
              }),
              map(() => ({ ...created, checklistId })),
            );
          }),
          catchError((err) => {
            this.logger.log('[DEBUG] createInspection checklist error:', err?.message);
            return of(created);
          }),
        );
      }),
    );
  }

  private autoCreateInvoice(
    dto: CreateInspectionDto,
    inspectionId: string,
    token: string,
  ): Observable<any> {
    const vehicleType = dto.vehicle_type;
    const revisionType = dto.revision_type;

    if (!vehicleType || !revisionType) {
      this.logger.log('[DEBUG] SKIP auto-invoice — missing vehicle_type or revision_type');
      return of(null);
    }

    const client$ = this.clientService.getClientById(dto.client_id, token).pipe(
      catchError(() => of(null)),
    );

    const status$ = this.statusService.findAll(token, 'PENDING').pipe(
      map((res) => {
        const list = Array.isArray(res?.data) ? res.data : (res?.data?.data ?? []);
        return list?.[0] ?? null;
      }),
      catchError(() => of(null)),
    );

    const price$ = this.priceService.findAll(token, vehicleType, revisionType).pipe(
      map((res) => {
        const list = Array.isArray(res?.data) ? res.data : (res?.data?.data ?? []);
        return list?.[0] ?? null;
      }),
      catchError(() => of(null)),
    );

    return forkJoin({ client: client$, status: status$, price: price$ }).pipe(
      switchMap(({ client, status, price }) => {
        if (!client || !status || !price) {
          this.logger.log('[DEBUG] SKIP auto-invoice — missing client, status or price data');
          return of(null);
        }

        const clientData = client?.data ?? client;
        const clientName = [clientData?.nombre, clientData?.apellido].filter(Boolean).join(' ');

        const payload = {
          inspection_id: inspectionId,
          client: {
            document: clientData?.identity ?? '',
            name: clientName || 'Cliente',
            address: clientData?.direccion,
            phone: clientData?.celular,
            email: clientData?.email,
          },
          items: [
            {
              concept: `Revisión ${revisionType} - ${vehicleType}`,
              quantity: 1,
              unitPrice: price?.amount ?? 0,
            },
          ],
          statusId: status?.id ?? '',
          observations: dto.observations,
        };

        this.logger.log(`[DEBUG] Auto-creating invoice for inspection ${inspectionId}`);
        return this.invoiceService.create(payload, token);
      }),
    );
  }

  generateInvoiceFromInspection(inspectionId: string, token: string): Observable<any> {
    return this.infrastructure.proxyRequest('GET', `/api/inspections/${inspectionId}`, null, {
      Authorization: `Bearer ${token}`,
    }).pipe(
      switchMap((response: any) => {
        const inspection = response?.data ?? response;

        if (!inspection) {
          throw new BadRequestException(`Inspection ${inspectionId} not found`);
        }

        const vehicleType = inspection.vehicle_type;
        const revisionType = inspection.revision_type;
        const clientId = inspection.client_id;

        if (!vehicleType || !revisionType) {
          throw new BadRequestException('Inspection missing vehicle_type or revision_type');
        }
        if (!clientId) {
          throw new BadRequestException('Inspection missing client_id');
        }

        const client$ = this.clientService.getClientById(clientId, token).pipe(
          catchError(() => {
            throw new BadRequestException(`Client ${clientId} not found`);
          }),
        );

        const status$ = this.statusService.findAll(token, 'PENDING').pipe(
          map((res) => {
            const list = Array.isArray(res?.data) ? res.data : (res?.data?.data ?? []);
            return list?.[0] ?? null;
          }),
          switchMap((status) => {
            if (!status) throw new BadRequestException('PENDING status not found');
            return of(status);
          }),
        );

        const price$ = this.priceService.findAll(token, vehicleType, revisionType).pipe(
          map((res) => {
            const list = Array.isArray(res?.data) ? res.data : (res?.data?.data ?? []);
            return list?.[0] ?? null;
          }),
          switchMap((price) => {
            if (!price) throw new BadRequestException(`Price not found for ${vehicleType}/${revisionType}`);
            return of(price);
          }),
        );

        return forkJoin({ client: client$, status: status$, price: price$ }).pipe(
          switchMap(({ client, status, price }) => {
            const clientData = client?.data ?? client;
            const clientName = [clientData?.nombre, clientData?.apellido].filter(Boolean).join(' ');

            const payload = {
              inspection_id: inspectionId,
              client: {
                document: clientData?.identity ?? '',
                name: clientName || 'Cliente',
                address: clientData?.direccion,
                phone: clientData?.celular,
                email: clientData?.email,
              },
              items: [
                {
                  concept: `Revisión ${revisionType} - ${vehicleType}`,
                  quantity: 1,
                  unitPrice: price?.amount ?? 0,
                },
              ],
              statusId: status?.id ?? '',
              observations: inspection.observations,
            };

            this.logger.log(`[DEBUG] Generating invoice for inspection ${inspectionId}`);
            return this.invoiceService.create(payload, token);
          }),
        );
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
          checklistId: dto.checklistId,
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

  updateInspectionStatus(id: string, statusId: string, token: string): Observable<any> {
    return this.infrastructure.proxyRequest('PATCH', `/api/inspections/${id}/status`, { statusId }, {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  updateChecklistId(id: string, checklistId: string, token: string): Observable<any> {
    return this.infrastructure.proxyRequest('PATCH', `/api/inspections/${id}/checklist-id`, { checklistId }, {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
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
