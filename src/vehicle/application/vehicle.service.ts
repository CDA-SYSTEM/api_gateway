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

  // Líneas
  createLinea(data: CreateCatalogoDto, token: string): Observable<any> {
    return this.vehicleInfrastructureService.proxyRequest('POST', '/linea', data, {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  listLineas(token: string): Observable<any> {
    return this.vehicleInfrastructureService.proxyRequest('GET', '/linea', null, {
      Authorization: `Bearer ${token}`,
    });
  }

  getLineaById(id: string, token: string): Observable<any> {
    return this.vehicleInfrastructureService.proxyRequest('GET', `/linea/${id}`, null, {
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

  // Colores
  createColor(data: CreateCatalogoDto, token: string): Observable<any> {
    return this.vehicleInfrastructureService.proxyRequest('POST', '/color', data, {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  listColores(token: string): Observable<any> {
    return this.vehicleInfrastructureService.proxyRequest('GET', '/color', null, {
      Authorization: `Bearer ${token}`,
    });
  }

  getColorById(id: string, token: string): Observable<any> {
    return this.vehicleInfrastructureService.proxyRequest('GET', `/color/${id}`, null, {
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

  // Tipos de Vehículo
  createTipoVehiculo(data: CreateCatalogoDto, token: string): Observable<any> {
    return this.vehicleInfrastructureService.proxyRequest('POST', '/tipo-vehiculo', data, {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  listTiposVehiculo(token: string): Observable<any> {
    return this.vehicleInfrastructureService.proxyRequest('GET', '/tipo-vehiculo', null, {
      Authorization: `Bearer ${token}`,
    });
  }

  getTipoVehiculoById(id: string, token: string): Observable<any> {
    return this.vehicleInfrastructureService.proxyRequest('GET', `/tipo-vehiculo/${id}`, null, {
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
}
