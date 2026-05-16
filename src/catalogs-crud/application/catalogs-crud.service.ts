import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { CatalogsCrudInfrastructureService } from '../infrastructure/catalogs-crud.service';

@Injectable()
export class CatalogsCrudService {
  constructor(private readonly infrastructure: CatalogsCrudInfrastructureService) {}

  list(type: string, token: string): Observable<any> {
    return this.infrastructure.list(type, token);
  }

  create(type: string, data: any, token: string): Observable<any> {
    return this.infrastructure.create(type, data, token);
  }

  getById(type: string, id: string, token: string): Observable<any> {
    return this.infrastructure.getById(type, id, token);
  }

  update(type: string, id: string, data: any, token: string): Observable<any> {
    return this.infrastructure.update(type, id, data, token);
  }

  delete(type: string, id: string, token: string): Observable<any> {
    return this.infrastructure.delete(type, id, token);
  }
}
