import { Injectable } from '@nestjs/common';
import { Observable, forkJoin } from 'rxjs';
import { TrackerInfrastructureService } from '../infrastructure/tracker.service';

@Injectable()
export class TrackerApplicationService {
  constructor(private readonly trackerInfrastructure: TrackerInfrastructureService) {}

  listClients(token: string): Observable<any> {
    return this.trackerInfrastructure.listClients(token);
  }

  getClientById(clienteId: string, token: string): Observable<any> {
    return this.trackerInfrastructure.getClientById(clienteId, token);
  }

  listVehiclesByClient(clienteId: string, token: string): Observable<any> {
    return this.trackerInfrastructure.listVehiclesByClient(clienteId, token);
  }

  listVehicles(token: string): Observable<any> {
    return this.trackerInfrastructure.listVehicles(token);
  }

  getVehicleByPlate(placa: string, token: string): Observable<any> {
    return this.trackerInfrastructure.getVehicleByPlate(placa, token);
  }

  listPlanillasByVehicle(placa: string, token: string): Observable<any> {
    return this.trackerInfrastructure.listPlanillasByVehicle(placa, token);
  }

  listPlanillas(token: string): Observable<any> {
    return this.trackerInfrastructure.listPlanillas(token);
  }

  getPlanillaById(planillaId: string, token: string): Observable<any> {
    return this.trackerInfrastructure.getPlanillaById(planillaId, token);
  }

  getStats(token: string): Observable<any> {
    return this.trackerInfrastructure.getStats(token);
  }

  getFullDashboard(token: string): Observable<any> {
    return forkJoin({
      clientes: this.trackerInfrastructure.listClients(token),
      vehiculos: this.trackerInfrastructure.listVehicles(token),
      planillas: this.trackerInfrastructure.listPlanillas(token),
      stats: this.trackerInfrastructure.getStats(token),
    });
  }
}
