export interface ClientData {
  id: number;
  nombre: string;
  apellido: string;
  identity: string;
  email: string;
  celular: string;
  direccion: string;
  birthDate: string;
  active: boolean;
  documentType: { id: number; type: string };
  personType: { id: number; type: string };
}
