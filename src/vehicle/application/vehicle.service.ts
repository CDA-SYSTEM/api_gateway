import { Injectable } from '@nestjs/common';
import { Observable, forkJoin, of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs';
import { VehicleInfrastructureService } from '../infrastructure/vehicle.service';
import { CreateCatalogoDto } from './dtos/create-catalogo.dto';
import { UpdateCatalogoDto } from './dtos/update-catalogo.dto';
import { CreateVehicleDto } from './dtos/create-vehicle.dto';
import { UpdateVehicleDto } from './dtos/update-vehicle.dto';
import { CACHE_KEYS, CACHE_TTL } from '../../cache/application/cache-keys.constant';
import { ClientsApplicationService } from '../../clients/application/clients.service';

@Injectable()
export class VehicleService {
  constructor(
    private readonly vehicleInfrastructureService: VehicleInfrastructureService,
    private readonly clientService: ClientsApplicationService,
  ) {}

  private enrichVehicleItem(item: any, token: string): Observable<any> {
    if (!item?.clienteId) return of(item);

    return this.clientService.getClientById(String(item.clienteId), token).pipe(
      catchError(() => of(null)),
      map((raw) => {
        const clientData = raw?.data ?? raw ?? null;
        return { ...item, client: clientData };
      }),
    );
  }

  private enrichVehicleList(items: any[], token: string): Observable<any[]> {
    if (!items.length) return of(items);

    const clientIds = [...new Set(items.map((i) => String(i.clienteId)).filter(Boolean))] as string[];

    const clientReqs = clientIds.map((id) =>
      this.clientService.getClientById(id, token).pipe(
        catchError(() => of(null)),
        map((raw) => ({ id, data: raw?.data ?? raw ?? null })),
      ),
    );

    if (!clientReqs.length) return of(items);

    return forkJoin(clientReqs).pipe(
      map((results: any[]) => {
        const clientMap = new Map(
          results.filter((r) => r).map((r) => [r.id, r.data]),
        );
        return items.map((item) => ({
          ...item,
          client: item.clienteId ? clientMap.get(String(item.clienteId)) ?? null : null,
        }));
      }),
    );
  }

  private enrichVehicleResponse(response: any, token: string): Observable<any> {
    if (response?.content && Array.isArray(response.content)) {
      return this.enrichVehicleList(response.content, token).pipe(
        map((enriched) => ({ ...response, content: enriched })),
      );
    }
    if (response?.data?.content && Array.isArray(response.data.content)) {
      return this.enrichVehicleList(response.data.content, token).pipe(
        map((enriched) => ({ ...response, data: { ...response.data, content: enriched } })),
      );
    }
    if (response?.id || response?.data?.id) {
      const item = response?.id ? response : response.data;
      return this.enrichVehicleItem(item, token).pipe(
        map((enriched) => {
          if (response?.id) return enriched;
          return { ...response, data: enriched };
        }),
      );
    }
    return of(response);
  }

  private enrichSafe(response: any, token: string): Observable<any> {
    return this.enrichVehicleResponse(response, token).pipe(
      catchError(() => of(response)),
    );
  }

  healthCheck(token: string): Observable<any> {
    return this.vehicleInfrastructureService.proxyRequestCached('GET', '/api/v1/health', 'vehicle:health', CACHE_TTL.SHORT, null, {
      Authorization: `Bearer ${token}`,
    });
  }

  createVehicle(data: CreateVehicleDto, token: string): Observable<any> {
    return this.vehicleInfrastructureService.proxyRequest('POST', '/vehiculo', data, {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  listVehicles(page?: number, size?: number, token?: string): Observable<any> {
    const queryParams = new URLSearchParams();
    if (page !== undefined) queryParams.append('page', page.toString());
    if (size !== undefined) queryParams.append('size', size.toString());
    
    const queryString = queryParams.toString();
    const url = `/vehiculo${queryString ? '?' + queryString : ''}`;
    
    return this.vehicleInfrastructureService.proxyRequestCached('GET', url, CACHE_KEYS.VEHICLE.VEHICULO_LIST(page, size), CACHE_TTL.SHORT, null, {
      Authorization: `Bearer ${token}`,
    });
  }

  getVehicleById(id: string, token: string): Observable<any> {
    return this.vehicleInfrastructureService.proxyRequestCached('GET', `/vehiculo/${id}`, CACHE_KEYS.VEHICLE.VEHICULO_BY_ID(id), CACHE_TTL.SHORT, null, {
      Authorization: `Bearer ${token}`,
    });
  }

  updateVehicle(id: string, data: UpdateVehicleDto, token: string): Observable<any> {
    return this.vehicleInfrastructureService.proxyRequest('PUT', `/vehiculo/${id}`, data, {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  deleteVehicle(id: string, token: string): Observable<any> {
    return this.vehicleInfrastructureService.proxyRequest('DELETE', `/vehiculo/${id}`, null, {
      Authorization: `Bearer ${token}`,
    });
  }

  listVehiclesByClientId(clientId: string, token: string): Observable<any> {
    return this.vehicleInfrastructureService.proxyRequestCached('GET', `/vehiculo/cliente/${clientId}`, CACHE_KEYS.VEHICLE.VEHICULOS_BY_CLIENT(clientId), CACHE_TTL.SHORT, null, {
      Authorization: `Bearer ${token}`,
    });
  }

  createMarca(data: CreateCatalogoDto, token: string): Observable<any> {
    return this.vehicleInfrastructureService.proxyRequest('POST', '/marca', data, {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  listMarcas(token: string): Observable<any> {
    return this.vehicleInfrastructureService.proxyRequestCached('GET', '/marca', CACHE_KEYS.VEHICLE.MARCA_LIST, CACHE_TTL.EXTRA_LONG, null, {
      Authorization: `Bearer ${token}`,
    });
  }

  getMarcaById(id: string, token: string): Observable<any> {
    return this.vehicleInfrastructureService.proxyRequestCached('GET', `/marca/${id}`, CACHE_KEYS.VEHICLE.MARCA_BY_ID(id), CACHE_TTL.EXTRA_LONG, null, {
      Authorization: `Bearer ${token}`,
    });
  }

  updateMarca(id: string, data: UpdateCatalogoDto, token: string): Observable<any> {
    return this.vehicleInfrastructureService.proxyRequest('PUT', `/marca/${id}`, data, {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  deleteMarca(id: string, token: string): Observable<any> {
    return this.vehicleInfrastructureService.proxyRequest('DELETE', `/marca/${id}`, null, {
      Authorization: `Bearer ${token}`,
    });
  }

  createClase(data: CreateCatalogoDto, token: string): Observable<any> {
    return this.vehicleInfrastructureService.proxyRequest('POST', '/clase', data, {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  listClases(token: string): Observable<any> {
    return this.vehicleInfrastructureService.proxyRequestCached('GET', '/clase', CACHE_KEYS.VEHICLE.CLASE_LIST, CACHE_TTL.EXTRA_LONG, null, {
      Authorization: `Bearer ${token}`,
    });
  }

  getClaseById(id: string, token: string): Observable<any> {
    return this.vehicleInfrastructureService.proxyRequestCached('GET', `/clase/${id}`, CACHE_KEYS.VEHICLE.CLASE_BY_ID(id), CACHE_TTL.EXTRA_LONG, null, {
      Authorization: `Bearer ${token}`,
    });
  }

  updateClase(id: string, data: UpdateCatalogoDto, token: string): Observable<any> {
    return this.vehicleInfrastructureService.proxyRequest('PUT', `/clase/${id}`, data, {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  deleteClase(id: string, token: string): Observable<any> {
    return this.vehicleInfrastructureService.proxyRequest('DELETE', `/clase/${id}`, null, {
      Authorization: `Bearer ${token}`,
    });
  }

  createLinea(data: CreateCatalogoDto, token: string): Observable<any> {
    return this.vehicleInfrastructureService.proxyRequest('POST', '/linea', data, {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  listLineas(token: string): Observable<any> {
    return this.vehicleInfrastructureService.proxyRequestCached('GET', '/linea', CACHE_KEYS.VEHICLE.LINEA_LIST, CACHE_TTL.EXTRA_LONG, null, {
      Authorization: `Bearer ${token}`,
    });
  }

  getLineaById(id: string, token: string): Observable<any> {
    return this.vehicleInfrastructureService.proxyRequestCached('GET', `/linea/${id}`, CACHE_KEYS.VEHICLE.LINEA_BY_ID(id), CACHE_TTL.EXTRA_LONG, null, {
      Authorization: `Bearer ${token}`,
    });
  }

  updateLinea(id: string, data: UpdateCatalogoDto, token: string): Observable<any> {
    return this.vehicleInfrastructureService.proxyRequest('PUT', `/linea/${id}`, data, {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  deleteLinea(id: string, token: string): Observable<any> {
    return this.vehicleInfrastructureService.proxyRequest('DELETE', `/linea/${id}`, null, {
      Authorization: `Bearer ${token}`,
    });
  }

  createColor(data: CreateCatalogoDto, token: string): Observable<any> {
    return this.vehicleInfrastructureService.proxyRequest('POST', '/color', data, {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  listColores(token: string): Observable<any> {
    return this.vehicleInfrastructureService.proxyRequestCached('GET', '/color', CACHE_KEYS.VEHICLE.COLOR_LIST, CACHE_TTL.EXTRA_LONG, null, {
      Authorization: `Bearer ${token}`,
    });
  }

  getColorById(id: string, token: string): Observable<any> {
    return this.vehicleInfrastructureService.proxyRequestCached('GET', `/color/${id}`, CACHE_KEYS.VEHICLE.COLOR_BY_ID(id), CACHE_TTL.EXTRA_LONG, null, {
      Authorization: `Bearer ${token}`,
    });
  }

  updateColor(id: string, data: UpdateCatalogoDto, token: string): Observable<any> {
    return this.vehicleInfrastructureService.proxyRequest('PUT', `/color/${id}`, data, {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  deleteColor(id: string, token: string): Observable<any> {
    return this.vehicleInfrastructureService.proxyRequest('DELETE', `/color/${id}`, null, {
      Authorization: `Bearer ${token}`,
    });
  }

  createTipoVehiculo(data: CreateCatalogoDto, token: string): Observable<any> {
    return this.vehicleInfrastructureService.proxyRequest('POST', '/tipo-vehiculo', data, {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  listTiposVehiculo(token: string): Observable<any> {
    return this.vehicleInfrastructureService.proxyRequestCached('GET', '/tipo-vehiculo', CACHE_KEYS.VEHICLE.TIPO_VEHICULO_LIST, CACHE_TTL.EXTRA_LONG, null, {
      Authorization: `Bearer ${token}`,
    });
  }

  getTipoVehiculoById(id: string, token: string): Observable<any> {
    return this.vehicleInfrastructureService.proxyRequestCached('GET', `/tipo-vehiculo/${id}`, CACHE_KEYS.VEHICLE.TIPO_VEHICULO_BY_ID(id), CACHE_TTL.EXTRA_LONG, null, {
      Authorization: `Bearer ${token}`,
    });
  }

  updateTipoVehiculo(id: string, data: UpdateCatalogoDto, token: string): Observable<any> {
    return this.vehicleInfrastructureService.proxyRequest('PUT', `/tipo-vehiculo/${id}`, data, {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  deleteTipoVehiculo(id: string, token: string): Observable<any> {
    return this.vehicleInfrastructureService.proxyRequest('DELETE', `/tipo-vehiculo/${id}`, null, {
      Authorization: `Bearer ${token}`,
    });
  }

  createTipoCombustible(data: CreateCatalogoDto, token: string): Observable<any> {
    return this.vehicleInfrastructureService.proxyRequest('POST', '/tipo-combustible', data, {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  listTiposCombustible(token: string): Observable<any> {
    return this.vehicleInfrastructureService.proxyRequestCached('GET', '/tipo-combustible', CACHE_KEYS.VEHICLE.TIPO_COMBUSTIBLE_LIST, CACHE_TTL.EXTRA_LONG, null, {
      Authorization: `Bearer ${token}`,
    });
  }

  getTipoCombustibleById(id: string, token: string): Observable<any> {
    return this.vehicleInfrastructureService.proxyRequestCached('GET', `/tipo-combustible/${id}`, CACHE_KEYS.VEHICLE.TIPO_COMBUSTIBLE_BY_ID(id), CACHE_TTL.EXTRA_LONG, null, {
      Authorization: `Bearer ${token}`,
    });
  }

  updateTipoCombustible(id: string, data: UpdateCatalogoDto, token: string): Observable<any> {
    return this.vehicleInfrastructureService.proxyRequest('PUT', `/tipo-combustible/${id}`, data, {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  deleteTipoCombustible(id: string, token: string): Observable<any> {
    return this.vehicleInfrastructureService.proxyRequest('DELETE', `/tipo-combustible/${id}`, null, {
      Authorization: `Bearer ${token}`,
    });
  }

  createTipoServicio(data: CreateCatalogoDto, token: string): Observable<any> {
    return this.vehicleInfrastructureService.proxyRequest('POST', '/tipo-servicio', data, {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  listTiposServicio(token: string): Observable<any> {
    return this.vehicleInfrastructureService.proxyRequestCached('GET', '/tipo-servicio', CACHE_KEYS.VEHICLE.TIPO_SERVICIO_LIST, CACHE_TTL.EXTRA_LONG, null, {
      Authorization: `Bearer ${token}`,
    });
  }

  getTipoServicioById(id: string, token: string): Observable<any> {
    return this.vehicleInfrastructureService.proxyRequestCached('GET', `/tipo-servicio/${id}`, CACHE_KEYS.VEHICLE.TIPO_SERVICIO_BY_ID(id), CACHE_TTL.EXTRA_LONG, null, {
      Authorization: `Bearer ${token}`,
    });
  }

  updateTipoServicio(id: string, data: UpdateCatalogoDto, token: string): Observable<any> {
    return this.vehicleInfrastructureService.proxyRequest('PUT', `/tipo-servicio/${id}`, data, {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  deleteTipoServicio(id: string, token: string): Observable<any> {
    return this.vehicleInfrastructureService.proxyRequest('DELETE', `/tipo-servicio/${id}`, null, {
      Authorization: `Bearer ${token}`,
    });
  }
}
