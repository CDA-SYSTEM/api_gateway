import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ClientsInfrastructureService } from '../infrastructure/clients.service';

@Injectable()
export class PersonTypesService {
  constructor(private readonly clientsInfrastructure: ClientsInfrastructureService) {}

  listAll(token: string): Observable<any> {
    return this.clientsInfrastructure.proxyRequest('GET', '/person-types', null, {
      Authorization: `Bearer ${token}`,
    });
  }
}
