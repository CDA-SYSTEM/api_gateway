import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ChecklistInfrastructureService } from '../infrastructure/checklist.service';

@Injectable()
export class TemplatesChecklistService {
  constructor(private readonly infrastructure: ChecklistInfrastructureService) {}

  list(vehicleType: string | undefined, token: string): Observable<any> {
    return this.infrastructure.listTemplates(vehicleType, token);
  }

  create(data: any, token: string): Observable<any> {
    return this.infrastructure.createTemplate(data, token);
  }

  getActiveMotoTemplate(token: string): Observable<any> {
    return this.infrastructure.getActiveMotoTemplate(token);
  }

  getActiveLivianosPesadosTemplate(token: string): Observable<any> {
    return this.infrastructure.getActiveLivianosPesadosTemplate(token);
  }

  getActiveByVehicleType(vehicleType: string, token: string): Observable<any> {
    return this.infrastructure.getActiveTemplateByVehicleType(vehicleType, token);
  }

  getById(id: string, token: string): Observable<any> {
    return this.infrastructure.getTemplateById(id, token);
  }

  update(id: string, data: any, token: string): Observable<any> {
    return this.infrastructure.updateTemplate(id, data, token);
  }

  delete(id: string, token: string): Observable<any> {
    return this.infrastructure.deleteTemplate(id, token);
  }
}
