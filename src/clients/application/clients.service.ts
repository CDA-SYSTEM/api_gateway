import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ClientsInfrastructureService } from '../infrastructure/clients.service';

@Injectable()
export class ClientsApplicationService {
  constructor(private readonly clientsInfrastructure: ClientsInfrastructureService) {}

  healthCheck(token: string): Observable<any> {
    return this.clientsInfrastructure.proxyRequest('GET', '/api/v1/health', null, {
      Authorization: `Bearer ${token}`,
    });
  }
}
