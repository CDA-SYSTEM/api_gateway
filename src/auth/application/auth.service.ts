import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthInfrastructureService } from '../infrastructure/auth.service';

@Injectable()
export class AuthApplicationService {
  constructor(private readonly authInfrastructureService: AuthInfrastructureService) {}

  login(data: any): Observable<any> {
    return this.authInfrastructureService.proxyRequest('POST', '/auth/login', data);
  }

  register(data: any, token: string): Observable<any> {
    return this.authInfrastructureService.proxyRequest('POST', '/auth/register', data, {
      Authorization: `Bearer ${token}`,
    });
  }

  getUsers(role: string, token: string): Observable<any> {
    return this.authInfrastructureService.proxyRequest('GET', `/auth/users?role=${role}`, null, {
      Authorization: `Bearer ${token}`,
    });
  }

  getUserById(id: string, token: string): Observable<any> {
    return this.authInfrastructureService.proxyRequest('GET', `/auth/users/${id}`, null, {
      Authorization: `Bearer ${token}`,
    });
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
    return this.authInfrastructureService.proxyRequest('GET', `/auth/users/search?q=${query}`, null, {
      Authorization: `Bearer ${token}`,
    });
  }

  checkModuleAccess(module: string, token: string): Observable<any> {
    return this.authInfrastructureService.proxyRequest('GET', `/auth/modules/${module}`, null, {
      Authorization: `Bearer ${token}`,
    });
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
    return this.authInfrastructureService.proxyRequest('GET', '/auth/users/inspectors', null, {
      Authorization: `Bearer ${token}`,
    });
  }

  getOperarios(token: string): Observable<any> {
    return this.authInfrastructureService.proxyRequest('GET', '/auth/users/operarios', null, {
      Authorization: `Bearer ${token}`,
    });
  }

  logout(refreshToken: string): Observable<any> {
    return this.authInfrastructureService.proxyRequest('POST', '/auth/logout', { refreshToken });
  }
}
