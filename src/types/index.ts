// Tipos para la aplicación de sastrería

export type UserRole = 'admin' | 'user';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt: string;
}

export type ItemType = 'saco' | 'pantalon' | 'camisa' | 'chaleco' | 'corbata' | 'zapatos' | 'accesorio';

export type ItemStatus = 'disponible' | 'alquilado' | 'vendido' | 'reservado' | 'no_disponible' | 'fuera_servicio';

export interface InventoryItem {
  id: string;
  name: string;
  type: ItemType;
  size: string;
  color: string;
  description: string;
  status: ItemStatus;
  price: number;
  rentalPrice: number;
  createdAt: string;
  updatedAt: string;
}

export interface ClientMeasurements {
  chest: number; // Pecho
  waist: number; // Cintura
  hips: number; // Cadera
  shoulders: number; // Hombros
  armLength: number; // Largo de brazo
  inseam: number; // Entrepierna
  neck: number; // Cuello
  shoeSize: number; // Talla de zapato
}

export interface Client {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  address: string;
  measurements: ClientMeasurements;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface Rental {
  id: string;
  clientId: string;
  itemId: string;
  startDate: string;
  endDate: string;
  returnDate?: string;
  status: 'activo' | 'devuelto' | 'vencido';
  totalPrice: number;
  deposit: number;
  notes: string;
  createdAt: string;
}
