export interface CatalogItem {
  value: string;
  label: string;
}

export const VEHICLE_TYPES: CatalogItem[] = [
  { value: 'MOTOCICLETA_2_TIEMPOS', label: 'Motocicleta 2 Tiempos' },
  { value: 'MOTOCICLETA_4_TIEMPOS', label: 'Motocicleta 4 Tiempos' },
  { value: 'LIVIANO', label: 'Liviano' },
  { value: 'PESADO', label: 'Pesado' },
];

export const FUEL_TYPES: CatalogItem[] = [
  { value: 'GASOLINA', label: 'Gasolina' },
  { value: 'DIESEL', label: 'Diesel' },
  { value: 'GAS', label: 'Gas' },
  { value: 'GAS_GASOLINA', label: 'Gas/Gasolina' },
];

export const SERVICE_TYPES: CatalogItem[] = [
  { value: 'PARTICULAR', label: 'Particular' },
  { value: 'PUBLICO', label: 'Público' },
  { value: 'OFICIAL', label: 'Oficial' },
  { value: 'EXTRANJERO', label: 'Extranjero' },
  { value: 'DIPLOMATICO', label: 'Diplomático' },
  { value: 'TEMPORAL', label: 'Temporal' },
];

export const TIRE_POSITIONS: CatalogItem[] = [
  { value: 'FRONT_LEFT', label: 'Delantero Izquierdo' },
  { value: 'FRONT_RIGHT', label: 'Delantero Derecho' },
  { value: 'REAR_LEFT', label: 'Trasero Izquierdo' },
  { value: 'REAR_RIGHT', label: 'Trasero Derecho' },
  { value: 'SPARE', label: 'Repuesto' },
  { value: 'TIRE_1', label: 'Llanta 1' },
  { value: 'TIRE_2', label: 'Llanta 2' },
  { value: 'TIRE_3', label: 'Llanta 3' },
  { value: 'TIRE_4', label: 'Llanta 4' },
  { value: 'TIRE_5', label: 'Llanta 5' },
  { value: 'TIRE_6', label: 'Llanta 6' },
  { value: 'TIRE_7', label: 'Llanta 7' },
  { value: 'TIRE_8', label: 'Llanta 8' },
  { value: 'TIRE_9', label: 'Llanta 9' },
  { value: 'TIRE_10', label: 'Llanta 10' },
  { value: 'TIRE_11', label: 'Llanta 11' },
  { value: 'TIRE_12', label: 'Llanta 12' },
];

export const TERNARY_CHOICES: CatalogItem[] = [
  { value: 'SI', label: 'Sí' },
  { value: 'NO', label: 'No' },
  { value: 'NO_APLICA', label: 'No Aplica' },
];

export const REVISION_TYPES: CatalogItem[] = [
  { value: 'TECNICO_MECANICA', label: 'Técnico Mecánica' },
  { value: 'PREVENTIVA', label: 'Preventiva' },
];

export const BRAKE_FLUID_SIGHT_GLASSES: CatalogItem[] = [
  { value: 'BUEN_ESTADO', label: 'Buen Estado' },
  { value: 'MAL_ESTADO', label: 'Mal Estado' },
  { value: 'NO_APLICA', label: 'No Aplica' },
];

export const CUSTOMER_TYPES: CatalogItem[] = [
  { value: 'PROPIETARIO', label: 'Propietario' },
  { value: 'ENCARGADO', label: 'Encargado' },
];

export const AXLE_TYPES: CatalogItem[] = [
  { value: 'DELANTERO', label: 'Delantero' },
  { value: 'TRASERO', label: 'Trasero' },
  { value: 'MOTRIZ', label: 'Motriz' },
  { value: 'AUXILIAR', label: 'Auxiliar' },
  { value: 'ELEVADIZO', label: 'Elevadizo' },
];
