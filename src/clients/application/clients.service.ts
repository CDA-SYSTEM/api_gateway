import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ClientsInfrastructureService } from '../infrastructure/clients.service';
import { UpdateClientDto } from './dtos/update-client.dto';
import { CreateClientDto } from './dtos/create-client.dto';
import { ListClientsQueryDto } from './dtos/list-clients-query.dto';

@Injectable()
export class ClientsApplicationService {
  constructor(private readonly clientsInfrastructure: ClientsInfrastructureService) {}

  createClient(data: CreateClientDto, token: string): Observable<any> {
    return this.clientsInfrastructure.proxyRequest('POST', '/clients', data, {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  listClients(query: ListClientsQueryDto, token: string): Observable<any> {
    const params = new URLSearchParams();
    params.append('page', query.page.toString());
    params.append('size', query.size.toString());
    if (query.search) params.append('search', query.search);
    if (query.documentTypeId !== undefined) params.append('documentTypeId', query.documentTypeId.toString());
    if (query.personTypeId !== undefined) params.append('personTypeId', query.personTypeId.toString());
    return this.clientsInfrastructure.proxyRequest('GET', `/clients?${params.toString()}`, null, {
      Authorization: `Bearer ${token}`,
    });
  }

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

  getClientFullById(id: string, token: string): Observable<any> {
    return this.clientsInfrastructure.proxyRequest('GET', `/clients/${id}/full`, null, {
      Authorization: `Bearer ${token}`,
    });
  }

  updateClient(id: string, data: UpdateClientDto, token: string): Observable<any> {
    return this.clientsInfrastructure.proxyRequest('PUT', `/clients/${id}`, data, {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  deleteClient(id: string, token: string): Observable<any> {
    return this.clientsInfrastructure.proxyRequest('DELETE', `/clients/${id}`, null, {
      Authorization: `Bearer ${token}`,
    });
  }

  activateClient(id: string, token: string): Observable<any> {
    return this.clientsInfrastructure.proxyRequest('PUT', `/clients/${id}/activate`, null, {
      Authorization: `Bearer ${token}`,
    });
  }
}
