import { ClientData } from '../dtos/client-data.interface';
import { InspectionItem } from '../dtos/inspection-item.interface';
import { InspectionsResponse } from '../dtos/inspections-response.interface';

function mapClient(rawClient: any): ClientData | null {
  if (!rawClient?.success) return null;
  return (rawClient.data as ClientData) ?? null;
}

export function mapInspectionsResponse(
  raw: any,
  clientMap: Map<string, any>,
): InspectionsResponse {
  const envelopeData = raw?.data ?? raw;
  const items: any[] = Array.isArray(envelopeData) ? envelopeData : (envelopeData?.data ?? []);

  return {
    data: items.map((item: any) => ({
      ...item,
      client: mapClient(clientMap.get(item.client_id)),
    })) as InspectionItem[],
    total: envelopeData.total,
    page: envelopeData.page,
    size: envelopeData.size,
    totalPages: envelopeData.totalPages,
  };
}
