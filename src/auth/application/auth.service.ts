import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthInfrastructureService } from '../infrastructure/auth.service';
import { CacheInfrastructureService } from '../../cache/infrastructure/cache.service';
import { CACHE_KEYS, CACHE_TTL } from '../../cache/application/cache-keys.constant';

@Injectable()
export class AuthApplicationService {
  constructor(
    private readonly authInfrastructureService: AuthInfrastructureService,
    private readonly cacheService: CacheInfrastructureService,
  ) {}

  login(data: any): Observable<any> {
    return this.authInfrastructureService.proxyRequest('POST', '/auth/login', data);
  }

  register(data: any, token: string): Observable<any> {
    return this.authInfrastructureService.proxyRequest('POST', '/auth/register', data, {
      Authorization: `Bearer ${token}`,
    });
  }

  registerPersonnel(data: any, token: string): Observable<any> {
    return this.authInfrastructureService.proxyRequest('POST', '/admin/personnel/register', data, {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  getUsers(role: string, token: string): Observable<any> {
    return this.cacheService.getOrFetch(CACHE_KEYS.AUTH.USERS_BY_ROLE(role), token, () =>
      this.authInfrastructureService.proxyRequest('GET', `/auth/users?role=${role}`, null, {
        Authorization: `Bearer ${token}`,
      }),
      CACHE_TTL.MEDIUM,
    );
  }

  getUserById(id: string, token: string): Observable<any> {
    return this.cacheService.getOrFetch(CACHE_KEYS.AUTH.USER_BY_ID(id), token, () =>
      this.authInfrastructureService.proxyRequest('GET', `/auth/users/${id}`, null, {
        Authorization: `Bearer ${token}`,
      }),
      CACHE_TTL.MEDIUM,
    );
  }

  updateUser(id: string, data: any, token: string): Observable<any> {
    return this.authInfrastructureService.proxyRequest('PATCH', `/auth/users/${id}`, data, {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  validateToken(token: string): Observable<any> {
    return this.authInfrastructureService.proxyRequest('POST', '/auth/validate-token', { token });
  }

  refreshToken(refreshToken: string): Observable<any> {
    return this.authInfrastructureService.proxyRequest('POST', '/auth/refresh', { refreshToken });
  }

  searchUsers(query: string, token: string): Observable<any> {
    return this.cacheService.getOrFetch(CACHE_KEYS.AUTH.USERS_SEARCH(query), token, () =>
      this.authInfrastructureService.proxyRequest('GET', `/auth/users/search?q=${query}`, null, {
        Authorization: `Bearer ${token}`,
      }),
      CACHE_TTL.MEDIUM,
    );
  }

  checkModuleAccess(module: string, token: string): Observable<any> {
    return this.cacheService.getOrFetch(CACHE_KEYS.AUTH.MODULE_ACCESS(module), token, () =>
      this.authInfrastructureService.proxyRequest('GET', `/auth/modules/${module}`, null, {
        Authorization: `Bearer ${token}`,
      }),
      CACHE_TTL.SHORT,
    );
  }

  inactivateUser(id: string, token: string): Observable<any> {
    return this.authInfrastructureService.proxyRequest('PATCH', `/auth/users/${id}/inactivate`, null, {
      Authorization: `Bearer ${token}`,
    });
  }

  deleteUser(id: string, token: string): Observable<any> {
    return this.authInfrastructureService.proxyRequest('DELETE', `/auth/users/${id}`, null, {
      Authorization: `Bearer ${token}`,
    });
  }

  getInspectors(token: string): Observable<any> {
    return this.cacheService.getOrFetch(CACHE_KEYS.AUTH.INSPECTORS, token, () =>
      this.authInfrastructureService.proxyRequest('GET', '/auth/users/inspectors', null, {
        Authorization: `Bearer ${token}`,
      }),
      CACHE_TTL.MEDIUM,
    );
  }

  getOperarios(token: string): Observable<any> {
    return this.cacheService.getOrFetch(CACHE_KEYS.AUTH.OPERARIOS, token, () =>
      this.authInfrastructureService.proxyRequest('GET', '/auth/users/operarios', null, {
        Authorization: `Bearer ${token}`,
      }),
      CACHE_TTL.MEDIUM,
    );
  }

  listRoles(token: string): Observable<any> {
    return this.cacheService.getOrFetch(CACHE_KEYS.AUTH.ROLES, token, () =>
      this.authInfrastructureService.proxyRequest('GET', '/auth/roles', null, {
        Authorization: `Bearer ${token}`,
      }),
      CACHE_TTL.LONG,
    );
  }

  listIdentificationTypes(token: string): Observable<any> {
    return this.cacheService.getOrFetch(CACHE_KEYS.AUTH.IDENTIFICATION_TYPES, token, () =>
      this.authInfrastructureService.proxyRequest('GET', '/auth/identification-types', null, {
        Authorization: `Bearer ${token}`,
      }),
      CACHE_TTL.LONG,
    );
  }

  logout(refreshToken: string): Observable<any> {
    return this.authInfrastructureService.proxyRequest('POST', '/auth/logout', { refreshToken });
  }
}
