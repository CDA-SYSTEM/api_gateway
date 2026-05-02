import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { PUBLIC_KEY } from '../decorators/public.decorator';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Roles } from '../constants/roles.constant';
import { Request } from 'express';

@Injectable()
export class CombinedGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.get<boolean>(PUBLIC_KEY, context.getHandler()) ||
      this.reflector.get<boolean>(PUBLIC_KEY, context.getClass());

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();

    if (!request || !request.headers) {
      throw new UnauthorizedException('Solicitud inválida');
    }

    const apiKey = request.headers['x-api-key'];
    const validApiKey = this.configService.get<string>('API_KEY_FRONT');

    if (!validApiKey || apiKey !== validApiKey) {
      throw new UnauthorizedException('API key inválida');
    }

    const authHeader = request.headers['authorization'];
    if (!authHeader) {
      throw new UnauthorizedException('Token no proporcionado');
    }

    const [type, token] = authHeader.split(' ');
    if (type !== 'Bearer' || !token) {
      throw new UnauthorizedException('Token inválido');
    }

    return from(
      this.httpService.post<{ valid: boolean; roles: string[]; userId: string }>(
        `${this.configService.get<string>('AUTH_SERVICE_BASE_URL')}/auth/validate-token`,
        { token }
      ).pipe(
        switchMap((response: AxiosResponse<{ valid: boolean; roles: string[]; userId: string }>) => {
          const data = response.data;
          if (!data.valid) {
            throw new UnauthorizedException('Token inválido o expirado');
          }

          request.user = {
            userId: data.userId,
            roles: data.roles,
          };

          const requiredRoles = this.reflector.get<string[]>(ROLES_KEY, context.getHandler()) ||
            this.reflector.get<string[]>(ROLES_KEY, context.getClass());

          if (!requiredRoles || requiredRoles.length === 0) {
            return [true];
          }

          const hasRole = requiredRoles.some((role: string) => data.roles.includes(role));
          if (!hasRole) {
            throw new ForbiddenException('No tienes permisos para acceder a este recurso');
          }

          return [true];
        })
      )
    );
  }
}
