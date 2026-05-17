import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ChecklistInfrastructureService } from '../infrastructure/checklist.service';

@Injectable()
export class LabradoChecklistService {
  constructor(private readonly infrastructure: ChecklistInfrastructureService) {}

  create(data: any, token: string): Observable<any> {
    return this.infrastructure.createLabrado(data, token);
  }

  getByInspection(inspectionId: string, token: string): Observable<any> {
    return this.infrastructure.getLabradoByInspection(inspectionId, token);
  }

  updateByInspection(inspectionId: string, data: any, token: string): Observable<any> {
    return this.infrastructure.updateLabradoByInspection(inspectionId, data, token);
  }
}
