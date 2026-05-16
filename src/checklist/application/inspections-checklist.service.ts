import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ChecklistInfrastructureService } from '../infrastructure/checklist.service';

@Injectable()
export class InspectionsChecklistService {
  constructor(private readonly infrastructure: ChecklistInfrastructureService) {}

  list(token: string): Observable<any> {
    return this.infrastructure.listInspections(token);
  }

  create(data: any, token: string): Observable<any> {
    return this.infrastructure.createInspection(data, token);
  }

  getById(id: string, token: string): Observable<any> {
    return this.infrastructure.getInspectionById(id, token);
  }

  update(id: string, data: any, token: string): Observable<any> {
    return this.infrastructure.updateInspection(id, data, token);
  }

  delete(id: string, token: string): Observable<any> {
    return this.infrastructure.deleteInspection(id, token);
  }

  getByPlate(plate: string, token: string): Observable<any> {
    return this.infrastructure.getInspectionsByPlate(plate, token);
  }

  getByDate(start: string, end: string, token: string): Observable<any> {
    return this.infrastructure.getInspectionsByDate(start, end, token);
  }

  getByStatus(status: string, token: string): Observable<any> {
    return this.infrastructure.getInspectionsByStatus(status, token);
  }

  getByVehicle(vehicleId: string, token: string): Observable<any> {
    return this.infrastructure.getInspectionsByVehicle(vehicleId, token);
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
