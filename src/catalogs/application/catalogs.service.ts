import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { CatalogsInfrastructureService } from '../infrastructure/catalogs.service';

@Injectable()
export class CatalogsService {
  constructor(private readonly catalogsInfrastructureService: CatalogsInfrastructureService) {}

  getVehicleTypes(): Observable<any> {
    return this.catalogsInfrastructureService.proxyRequest('GET', '/api/catalogs/vehicle-types');
  }

  getFuelTypes(): Observable<any> {
    return this.catalogsInfrastructureService.proxyRequest('GET', '/api/catalogs/fuel-types');
  }

  getServiceTypes(): Observable<any> {
    return this.catalogsInfrastructureService.proxyRequest('GET', '/api/catalogs/service-types');
  }

  getTirePositions(): Observable<any> {
    return this.catalogsInfrastructureService.proxyRequest('GET', '/api/catalogs/tire-positions');
  }

  getTernaryChoices(): Observable<any> {
    return this.catalogsInfrastructureService.proxyRequest('GET', '/api/catalogs/ternary-choices');
  }

  getRevisionTypes(): Observable<any> {
    return this.catalogsInfrastructureService.proxyRequest('GET', '/api/catalogs/revision-types');
  }

  getCustomerTypes(): Observable<any> {
    return this.catalogsInfrastructureService.proxyRequest('GET', '/api/catalogs/customer-types');
  }

  getBrakeFluidSightGlasses(): Observable<any> {
    return this.catalogsInfrastructureService.proxyRequest('GET', '/api/catalogs/brake-fluid-sight-glass');
  }
}
