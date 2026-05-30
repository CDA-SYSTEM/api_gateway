import { Injectable, Logger } from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { AuthInfrastructureService } from '../infrastructure/auth.service';
import { CacheInfrastructureService } from '../../cache/infrastructure/cache.service';
import { CACHE_KEYS, CACHE_TTL } from '../../cache/application/cache-keys.constant';

@Injectable()
export class AuthApplicationService {
  private readonly logger = new Logger(AuthApplicationService.name);

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
    }).pipe(
      tap({
        next: () => this.invalidateUsersCache(token),
        error: () => {},
      }),
    );
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
    }).pipe(
      tap({
        next: () => {
          this.invalidateUsersCache(token);
          this.cacheService.deleteByKey(CACHE_KEYS.AUTH.USER_BY_ID(id), token).subscribe({
            error: (err) => this.logger.error(`Error invalidating cache for user ${id}`, err),
          });
        },
        error: () => {},
      }),
    );
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
    }).pipe(
      tap({
        next: () => {
          this.invalidateUsersCache(token);
          this.cacheService.deleteByKey(CACHE_KEYS.AUTH.USER_BY_ID(id), token).subscribe({
            error: (err) => this.logger.error(`Error invalidating cache for user ${id}`, err),
          });
          this.cacheService.deleteByPrefix('oauth:*', token).subscribe({
            error: (err) => this.logger.error(`Error invalidating OAuth cache for user ${id}`, err),
          });
        },
        error: () => {},
      }),
    );
  }

  deleteUser(id: string, token: string): Observable<any> {
    return this.authInfrastructureService.proxyRequest('DELETE', `/auth/users/${id}`, null, {
      Authorization: `Bearer ${token}`,
    }).pipe(
      tap({
        next: () => {
          this.invalidateUsersCache(token);
          this.cacheService.deleteByKey(CACHE_KEYS.AUTH.USER_BY_ID(id), token).subscribe({
            error: (err) => this.logger.error(`Error invalidating cache for user ${id}`, err),
          });
          this.cacheService.deleteByPrefix('oauth:*', token).subscribe({
            error: (err) => this.logger.error(`Error invalidating OAuth cache for user ${id}`, err),
          });
        },
        error: () => {},
      }),
    );
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

  getUserOptions(role: string, token: string): Observable<any> {
    return this.authInfrastructureService.proxyRequest('GET', `/auth/users/options?role=${role}`, null, {
      Authorization: `Bearer ${token}`,
    });
  }

  getProfile(token: string): Observable<any> {
    return this.authInfrastructureService.proxyRequest('GET', '/auth/me', null, {
      Authorization: `Bearer ${token}`,
    });
  }

  changePassword(data: any, token: string): Observable<any> {
    return this.authInfrastructureService.proxyRequest('PATCH', '/auth/change-password', data, {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  getAuthAccounts(token: string): Observable<any> {
    return this.authInfrastructureService.proxyRequest('GET', '/admin/personnel/auth-accounts', null, {
      Authorization: `Bearer ${token}`,
    });
  }

  resetPassword(id: string, data: any, token: string): Observable<any> {
    return this.authInfrastructureService.proxyRequest('PATCH', `/admin/personnel/${id}/reset-password`, data, {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  oauthGoogle(data: any): Observable<any> {
    return this.authInfrastructureService.proxyRequest('POST', '/auth/oauth/google', data);
  }

  changeUserRole(id: string, data: any, token: string): Observable<any> {
    return this.authInfrastructureService.proxyRequest('PATCH', `/auth/users/${id}/role`, data, {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    }).pipe(
      tap({
        next: () => {
          this.invalidateUsersCache(token);
          this.cacheService.deleteByKey(CACHE_KEYS.AUTH.USER_BY_ID(id), token).subscribe({
            error: (err) => this.logger.error(`Error invalidating cache after role change for user ${id}`, err),
          });
          this.cacheService.deleteByKey(CACHE_KEYS.AUTH.ROLES, token).subscribe({
            error: (err) => this.logger.error('Error invalidating roles cache after role change', err),
          });
          this.cacheService.deleteByPrefix('auth:modules:*', token).subscribe({
            error: (err) => this.logger.error('Error invalidating module access cache after role change', err),
          });
        },
        error: () => {},
      }),
    );
  }

  updateRolePermissions(code: string, data: any, token: string): Observable<any> {
    return this.authInfrastructureService.proxyRequest('PATCH', `/auth/roles/${code}`, data, {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    }).pipe(
      tap({
        next: () => {
          this.cacheService.deleteByKey(CACHE_KEYS.AUTH.ROLES, token).subscribe({
            error: (err) => this.logger.error('Error invalidating roles cache after permission update', err),
          });
          this.cacheService.deleteByPrefix('auth:modules:*', token).subscribe({
            error: (err) => this.logger.error('Error invalidating module access cache after permission update', err),
          });
        },
        error: () => {},
      }),
    );
  }

  private invalidateUsersCache(token: string): void {
    this.cacheService.deleteByPrefix('auth:users:*', token).subscribe({
      error: (err) => this.logger.error('Error invalidating users cache', err),
    });
  }
}
