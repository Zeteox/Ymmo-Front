export interface AgencyResponse {
  id: number;
  name: string;
  city: string;
}

export interface BuildingResponse {
  id: number;
  name: string;
  price: number;
  description: string;
  address: string;
  type: string;
  state: string; 
  zone: string;
}

export interface BuildingPictureResponse {
  id: number;
  path: string;
  buildingId: number;
  contentType: string | null;
  data: string | null;
}

export interface UserResponse {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  isActive: boolean;
  role: string;
  agencyId: number;
}

export interface AuthResponse {
  token: string;
  type: string;
  userId: number;
  email: string;
  role: string;
}

export interface TrendByZoneTypeResponse {
  zone: string;
  type: string;
  sales_count: number;
}

export interface ContactDemandResponse {
  id: number;
  content: string;
  userId: number;
  buildingId: number;
}

export interface TransactionResponse {
  id: number;
  buildingId: number;
  buildingName: string;
  buyerId: number;
  buyerFullName: string;
  agentId: number;
  agentFullName: string;
  agencyId: number;
  agencyName: string;
  amount: number;
  date: string;
}