import { Injectable, Logger } from '@nestjs/common';
import { Observable, forkJoin, of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs';
import { StatusService } from '../../status/application/status.service';
import { ReceptionInfrastructureService } from '../../reception/infrastructure/reception.service';
import { ChecklistInfrastructureService } from '../../checklist/infrastructure/checklist.service';

@Injectable()
export class InvoicePaidHandler {
  private readonly logger = new Logger(InvoicePaidHandler.name);

  constructor(
    private readonly statusService: StatusService,
    private readonly receptionInfra: ReceptionInfrastructureService,
    private readonly checklistInfra: ChecklistInfrastructureService,
  ) {}

  private fetchPaidStatusId = (token: string): Observable<string> =>
    this.statusService.findAll(token, 'PAID').pipe(
      map((res) => {
        const list = Array.isArray(res?.data) ? res.data : (res?.data?.data ?? []);
        return list?.[0]?.id ?? null;
      }),
    );

  private fetchInvoice = (invoiceId: string, token: string): Observable<any> =>
    this.receptionInfra.proxyRequest('GET', `/api/invoices/${invoiceId}`, null, {
      Authorization: `Bearer ${token}`,
    }).pipe(
      map((res) => res?.data ?? res),
    );

  private fetchInspection = (inspectionId: string, token: string): Observable<any> =>
    this.receptionInfra.proxyRequest('GET', `/api/inspections/${inspectionId}`, null, {
      Authorization: `Bearer ${token}`,
    }).pipe(
      map((res) => res?.data ?? res),
    );

  private fetchVehicle = (vehicleId: string, token: string): Observable<any> =>
    this.receptionInfra.proxyRequest('GET', `/api/vehicle/${vehicleId}`, null, {
      Authorization: `Bearer ${token}`,
    }).pipe(
      map((res) => res?.data ?? res),
      catchError(() => of(null)),
    );

  private fetchTemplates = (token: string): Observable<{ moto: any; livianos: any }> =>
    forkJoin({
      moto: this.checklistInfra.getActiveMotoTemplate(token).pipe(catchError(() => of(null))),
      livianos: this.checklistInfra.getActiveLivianosPesadosTemplate(token).pipe(catchError(() => of(null))),
    }).pipe(
      map(({ moto, livianos }) => ({
        moto: moto?.data ?? moto,
        livianos: livianos?.data ?? livianos,
      })),
    );

  private mapVehicleTipo = (tipo: string): string => {
    const normalized = tipo.toLowerCase();
    if (normalized === 'moto') return 'MOTO';
    if (normalized === 'pesado') return 'PESADO';
    return 'LIVIANO';
  };

  private resolveTemplateId = (vehicleType: string, templates: { moto: any; livianos: any }): string => {
    if (vehicleType === 'MOTO') return templates.moto?.id ?? templates.moto?.data?.id ?? '';
    return templates.livianos?.id ?? templates.livianos?.data?.id ?? '';
  };

  private checkExistingChecklist = (inspection: any): boolean =>
    !!(inspection.checklistId || inspection.checklist?.id);

  private buildChecklistPayload = (
    plate: string,
    vehicleId: number,
    clientId: number,
    vehicleType: string,
    templateId: string,
    inspectorId: string,
    observations: string,
  ): any => ({
    plate,
    vehicle_id: vehicleId,
    client_id: clientId,
    vehicle_type: vehicleType,
    template_id: templateId,
    inspection_datetime: new Date().toISOString(),
    inspector_id: inspectorId,
    observations: observations ?? '',
  });

  handle = (invoiceId: string, token: string): void => {
    this.logger.log(`[InvoicePaid] Checking invoice ${invoiceId} for PAID -> checklist trigger`);

    this.fetchInvoice(invoiceId, token).pipe(
      switchMap((invoice) => {
        if (!invoice) {
          this.logger.warn(`[InvoicePaid] Invoice ${invoiceId} not found`);
          return of(null);
        }

        const inspectionId = invoice.inspection_id;
        if (!inspectionId) {
          this.logger.warn(`[InvoicePaid] Invoice ${invoiceId} has no inspection_id`);
          return of(null);
        }

        return this.fetchInspection(inspectionId, token).pipe(
          switchMap((inspection) => {
            if (!inspection) {
              this.logger.warn(`[InvoicePaid] Inspection ${inspectionId} not found`);
              return of(null);
            }

            if (this.checkExistingChecklist(inspection)) {
              this.logger.log(`[InvoicePaid] Inspection ${inspectionId} already has a checklist, skipping`);
              return of(null);
            }

            const vehicleId = inspection.vehicle_id;
            if (!vehicleId) {
              this.logger.warn(`[InvoicePaid] Inspection ${inspectionId} missing vehicle_id`);
              return of(null);
            }

            return forkJoin({
              vehicle: this.fetchVehicle(vehicleId, token),
              templates: this.fetchTemplates(token),
            }).pipe(
              switchMap(({ vehicle, templates }) => {
                const tipo = (vehicle?.tipoVehiculo?.nombre ?? '').toLowerCase();
                const plate = vehicle?.placa ?? '';
                const vehicleType = this.mapVehicleTipo(tipo);
                const templateId = this.resolveTemplateId(vehicleType, templates);

                if (!templateId || !plate) {
                  this.logger.warn(`[InvoicePaid] Missing templateId or plate for inspection ${inspectionId}`);
                  return of(null);
                }

                const payload = this.buildChecklistPayload(
                  plate,
                  Number(vehicleId),
                  Number(inspection.client_id),
                  vehicleType,
                  templateId,
                  inspection.operator_id ?? inspection.responsible_id ?? '',
                  inspection.observations ?? '',
                );

                this.logger.log(`[InvoicePaid] Creating checklist for inspection ${inspectionId}`);
                return this.checklistInfra.createInspection(payload, token).pipe(
                  switchMap((checklistResult) => {
                    const checklistId = checklistResult?.id ?? checklistResult?.data?.id;
                    if (!checklistId) {
                      this.logger.warn(`[InvoicePaid] No checklistId in response for ${inspectionId}`);
                      return of(null);
                    }

                    this.logger.log(`[InvoicePaid] Patching inspection ${inspectionId} with checklistId ${checklistId}`);
                    return this.receptionInfra.proxyRequest(
                      'PATCH',
                      `/api/inspections/${inspectionId}/checklist-id`,
                      { checklistId },
                      {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                      },
                    ).pipe(
                      map(() => checklistId),
                      catchError((err) => {
                        this.logger.error(`[InvoicePaid] Failed to patch checklistId: ${err.message}`);
                        return of(null);
                      }),
                    );
                  }),
                  catchError((err) => {
                    this.logger.error(`[InvoicePaid] Failed to create checklist: ${err.message}`);
                    return of(null);
                  }),
                );
              }),
            );
          }),
        );
      }),
      catchError((err) => {
        this.logger.error(`[InvoicePaid] Error processing invoice ${invoiceId}: ${err.message}`);
        return of(null);
      }),
    ).subscribe({
      next: (result) => {
        if (result) {
          this.logger.log(`[InvoicePaid] Successfully created checklist ${result} for invoice ${invoiceId}`);
        }
      },
      error: (err) => this.logger.error(`[InvoicePaid] Unexpected error: ${err.message}`),
    });
  };
}
