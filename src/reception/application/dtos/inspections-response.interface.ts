import { InspectionItem } from './inspection-item.interface';

export interface InspectionsResponse {
  data: InspectionItem[];
  total: number;
  page: number;
  size: number;
  totalPages: number;
}
