export interface VehicleData {
  id: number;
  clienteId: string;
  marca: { id: number; nombre: string };
  clase: { id: number; nombre: string };
  linea: { id: number; nombre: string };
  color: { id: number; nombre: string };
  tipoVehiculo: { id: number; nombre: string };
  tipoCombustible: { id: number; nombre: string };
  tipoServicio: { id: number; nombre: string };
  modelo: string;
  placa: string;
  certificadoNo: string;
}
