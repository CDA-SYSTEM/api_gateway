import { ClientData } from '../dtos/client-data.interface';
import { VehicleData } from '../dtos/vehicle-data.interface';
import { UserData } from '../dtos/user-data.interface';
import { InspectionItem } from '../dtos/inspection-item.interface';
import { InspectionsResponse } from '../dtos/inspections-response.interface';

function mapClient(rawClient: any): ClientData | null {
  if (!rawClient?.success) return null;
  return (rawClient.data as ClientData) ?? null;
}

function mapVehicle(rawVehicle: any): VehicleData | null {
  if (!rawVehicle?.id) return null;
  return rawVehicle as VehicleData;
}

function mapOperator(rawUser: any): UserData | null {
  if (!rawUser) return null;
  const user = rawUser.data ?? rawUser;
  return user?.id ? (user as UserData) : null;
}

export function mapInspectionsResponse(
  raw: any,
  clientMap: Map<string, any>,
  vehicleMap?: Map<string, any>,
): InspectionsResponse {
  const envelopeData = raw?.data ?? raw;
  const items: any[] = Array.isArray(envelopeData) ? envelopeData : (envelopeData?.data ?? []);

  return {
    data: items.map((item: any) => ({
      ...item,
      client: mapClient(clientMap.get(item.client_id)),
      vehicle: vehicleMap ? mapVehicle(vehicleMap.get(item.vehicle_id)) : null,
    })) as InspectionItem[],
    total: envelopeData.total,
    page: envelopeData.page,
    size: envelopeData.size,
    totalPages: envelopeData.totalPages,
  };
}
