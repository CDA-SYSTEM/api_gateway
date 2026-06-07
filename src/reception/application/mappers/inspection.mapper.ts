import { ClientData } from '../dtos/client-data.interface';
import { VehicleData } from '../dtos/vehicle-data.interface';
import { UserData } from '../dtos/user-data.interface';
import { InspectionItem } from '../dtos/inspection-item.interface';
import { InspectionsResponse } from '../dtos/inspections-response.interface';

const FILE_URL_FIELDS = ['signature_url', 'photo_reception_url'] as const;

function normalizeFileUrl(url: string | undefined): string {
  if (!url) return '';
  const baseUrl = (process.env.API_GATEWAY_BASE_URL || '').replace(/\/+$/, '');
  if (!baseUrl) return url;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
}

function normalizeItemUrls(item: Record<string, any>): Record<string, any> {
  for (const field of FILE_URL_FIELDS) {
    if (item[field]) {
      item[field] = normalizeFileUrl(item[field]);
    }
  }
  return item;
}

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

function resolveOperatorId(item: any): string {
  return item.operator_id || item.responsible_id || item.customer_id || '';
}

export function mapInspectionItem(
  item: any,
  clientData: any,
  vehicleData: any,
  userData: any,
): InspectionItem {
  return normalizeItemUrls({
    ...item,
    client: mapClient(clientData),
    vehicle: mapVehicle(vehicleData),
    operator: mapOperator(userData),
  }) as InspectionItem;
}

export function mapInspectionsResponse(
  raw: any,
  clientMap: Map<string, any>,
  vehicleMap?: Map<string, any>,
  operatorMap?: Map<string, any>,
): InspectionsResponse {
  const envelopeData = raw?.data ?? raw;
  const items: any[] = Array.isArray(envelopeData) ? envelopeData : (envelopeData?.data ?? []);

  return {
    data: items.map((item: any) => normalizeItemUrls({
      ...item,
      client: mapClient(clientMap.get(item.client_id)),
      vehicle: vehicleMap ? mapVehicle(vehicleMap.get(item.vehicle_id)) : null,
      operator: operatorMap ? mapOperator(operatorMap.get(resolveOperatorId(item))) : null,
    })) as InspectionItem[],
    total: envelopeData.total,
    page: envelopeData.page,
    size: envelopeData.size,
    totalPages: envelopeData.totalPages,
  };
}
