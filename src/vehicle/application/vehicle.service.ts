import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { VehicleInfrastructureService } from '../infrastructure/vehicle.service';

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
}
