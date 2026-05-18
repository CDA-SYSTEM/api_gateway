import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ClientsInfrastructureService } from '../infrastructure/clients.service';
import { UpdateClientDto } from './dtos/update-client.dto';
import { CreateClientDto } from './dtos/create-client.dto';
import { ListClientsQueryDto } from './dtos/list-clients-query.dto';
import { CacheInfrastructureService } from '../../cache/infrastructure/cache.service';
import { CACHE_KEYS, CACHE_TTL } from '../../cache/application/cache-keys.constant';

@Injectable()
export class ClientsApplicationService {
  constructor(
    private readonly clientsInfrastructure: ClientsInfrastructureService,
    private readonly cacheService: CacheInfrastructureService,
  ) {}

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
    return this.cacheService.getOrFetch(CACHE_KEYS.CLIENTS.LIST(params.toString()), token, () =>
      this.clientsInfrastructure.proxyRequest('GET', `/clients?${params.toString()}`, null, {
        Authorization: `Bearer ${token}`,
      }),
      CACHE_TTL.SHORT,
    );
  }

  listAllClients(token: string): Observable<any> {
    return this.cacheService.getOrFetch(CACHE_KEYS.CLIENTS.ALL, token, () =>
      this.clientsInfrastructure.proxyRequest('GET', '/clients/all', null, {
        Authorization: `Bearer ${token}`,
      }),
      CACHE_TTL.SHORT,
    );
  }

  healthCheck(token: string): Observable<any> {
    return this.cacheService.getOrFetch('clients:health', token, () =>
      this.clientsInfrastructure.proxyRequest('GET', '/clients/health', null, {
        Authorization: `Bearer ${token}`,
      }),
      CACHE_TTL.SHORT,
    );
  }

  getClientById(id: string, token: string): Observable<any> {
    return this.cacheService.getOrFetch(CACHE_KEYS.CLIENTS.BY_ID(id), token, () =>
      this.clientsInfrastructure.proxyRequest('GET', `/clients/${id}`, null, {
        Authorization: `Bearer ${token}`,
      }),
      CACHE_TTL.SHORT,
    );
  }

  getClientFullById(id: string, token: string): Observable<any> {
    return this.cacheService.getOrFetch(CACHE_KEYS.CLIENTS.FULL_BY_ID(id), token, () =>
      this.clientsInfrastructure.proxyRequest('GET', `/clients/${id}/full`, null, {
        Authorization: `Bearer ${token}`,
      }),
      CACHE_TTL.SHORT,
    );
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
