import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { VehicleInfrastructureService } from '../infrastructure/vehicle.service';
import { CreateCatalogoDto } from './dtos/create-catalogo.dto';
import { UpdateCatalogoDto } from './dtos/update-catalogo.dto';
import { UpdateVehicleDto } from './dtos/update-vehicle.dto';

@Injectable()
export class VehicleService {
  constructor(private readonly vehicleInfrastructureService: VehicleInfrastructureService) {}

  healthCheck(token: string): Observable<any> {
    return this.vehicleInfrastructureService.proxyRequest('GET', '/api/v1/health', null, {
      Authorization: `Bearer ${token}`,
    });
  }

  getVehicleById(id: string, token: string): Observable<any> {
    return this.vehicleInfrastructureService.proxyRequest('GET', `/vehiculo/${id}`, null, {
      Authorization: `Bearer ${token}`,
    });
  }

  updateVehicle(id: string, data: UpdateVehicleDto, token: string): Observable<any> {
    return this.vehicleInfrastructureService.proxyRequest('PUT', `/vehiculo/${id}`, data, {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  // Marcas
  createMarca(data: CreateCatalogoDto, token: string): Observable<any> {
    return this.vehicleInfrastructureService.proxyRequest('POST', '/marca', data, {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  listMarcas(token: string): Observable<any> {
    return this.vehicleInfrastructureService.proxyRequest('GET', '/marca', null, {
      Authorization: `Bearer ${token}`,
    });
  }

  getMarcaById(id: string, token: string): Observable<any> {
    return this.vehicleInfrastructureService.proxyRequest('GET', `/marca/${id}`, null, {
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

  // Clases
  createClase(data: CreateCatalogoDto, token: string): Observable<any> {
    return this.vehicleInfrastructureService.proxyRequest('POST', '/clase', data, {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  listClases(token: string): Observable<any> {
    return this.vehicleInfrastructureService.proxyRequest('GET', '/clase', null, {
      Authorization: `Bearer ${token}`,
    });
  }

  getClaseById(id: string, token: string): Observable<any> {
    return this.vehicleInfrastructureService.proxyRequest('GET', `/clase/${id}`, null, {
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
}
