export interface Morador {
  id?: string;
  fullName: string;
  cpf?: string;
  rg?: string;
  birthDate?: string;
  phone?: string;
  email?: string;
  block: string;
  apartment: string;
  parkingSpot?: string;
  pets?: string;
  owner: boolean;
  moveInDate?: string;
  moveOutDate?: string;
  emergencyContact?: string;
  notes?: string;
}
