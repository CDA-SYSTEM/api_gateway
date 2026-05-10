import { ClientData } from './client-data.interface';
import { VehicleData } from './vehicle-data.interface';

export interface InspectionItem {
  id: string;
  inspection_number: string;
  mileage: number;
  date: string;
  inspection_date: string;
  client_id: string;
  vehicle_id: string;
  vehicle_type: string;
  fuel_type: string;
  fuel_certificate_number: string;
  service_type: string;
  operator_id: string;
  responsible_id: string;
  customer_id: string;
  customer_type: string;
  revision_type: string;
  tinted_windows: string;
  armored_vehicle: string;
  brake_fluid_sight_glass: string;
  observations: string;
  signature_url: string;
  photo_reception_url: string;
  checklist: Record<string, any>;
  axles: { index: number; axle_type: string }[];
  tires: { position: string; code: string; tire_pressure: number }[];
  deletedAt: string | null;
  client: ClientData | null;
  vehicle: VehicleData | null;
}
