import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ClientsInfrastructureService } from '../infrastructure/clients.service';
import { UpdateClientDto } from './dtos/update-client.dto';

@Injectable()
export class ClientsApplicationService {
  constructor(private readonly clientsInfrastructure: ClientsInfrastructureService) {}

  healthCheck(token: string): Observable<any> {
    return this.clientsInfrastructure.proxyRequest('GET', '/clients/health', null, {
      Authorization: `Bearer ${token}`,
    });
  }

  getClientById(id: string, token: string): Observable<any> {
    return this.clientsInfrastructure.proxyRequest('GET', `/clients/${id}`, null, {
      Authorization: `Bearer ${token}`,
    });
  }

  updateClient(id: string, data: UpdateClientDto, token: string): Observable<any> {
    return this.clientsInfrastructure.proxyRequest('PUT', `/clients/${id}`, data, {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }
}
