import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ClientsInfrastructureService } from '../infrastructure/clients.service';

@Injectable()
export class DocumentTypesService {
  constructor(private readonly clientsInfrastructure: ClientsInfrastructureService) {}

  listAll(token: string): Observable<any> {
    return this.clientsInfrastructure.proxyRequest('GET', '/document-types', null, {
      Authorization: `Bearer ${token}`,
    });
  }
}
