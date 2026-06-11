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

