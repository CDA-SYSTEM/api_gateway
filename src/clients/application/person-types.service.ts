import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ClientsInfrastructureService } from '../infrastructure/clients.service';
import { CacheInfrastructureService } from '../../cache/infrastructure/cache.service';
import { CACHE_KEYS, CACHE_TTL } from '../../cache/application/cache-keys.constant';

@Injectable()
export class PersonTypesService {
  constructor(
    private readonly clientsInfrastructure: ClientsInfrastructureService,
    private readonly cacheService: CacheInfrastructureService,
  ) {}

  listAll(token: string): Observable<any> {
    return this.cacheService.getOrFetch(CACHE_KEYS.CLIENTS.PERSON_TYPES, token, () =>
      this.clientsInfrastructure.proxyRequest('GET', '/person-types', null, {
        Authorization: `Bearer ${token}`,
      }),
      CACHE_TTL.EXTRA_LONG,
    );
  }
}
