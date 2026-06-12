import type { BuildingResponse } from "../types/api";

const BASE_URL = import.meta.env.VITE_MAIN_API_URL;

function authHeaders(): HeadersInit {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  };
}

export interface CreateBuildingData {
  name: string;
  price: number;
  description: string;
  address: string;
  buildingType: string;
  buildingState: string;
  zone: string;
  agencyId: number;
}

export const buildingApiService = {
  async createBuilding(data: CreateBuildingData): Promise<BuildingResponse> {
    const res = await fetch(`${BASE_URL}/buildings`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`Create failed: ${res.status}`);
    return res.json();
  },
  async deleteBuilding(buildingId: number): Promise<void> {
    await fetch(`${BASE_URL}/buildings/${buildingId}`, {
      method: "DELETE",
      headers: authHeaders(),
    });
  },
  async updateBuilding(buildingId:number, data:object) {
    const res = await fetch(`${BASE_URL}/buildings/${buildingId}`, {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`Update failed: ${res.status}`);
    return res.json();    
  }
};