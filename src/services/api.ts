import type {
  AgencyResponse,
  BuildingResponse,
  BuildingPictureResponse,
} from "../types/api";

const BASE_URL = import.meta.env.VITE_MAIN_API_URL ?? "/api";

function authHeaders(): HeadersInit {
  const token = localStorage.getItem("token");
  return token
    ? { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
    : { "Content-Type": "application/json" };
}

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, { headers: authHeaders() });
  if (!res.ok) throw new Error(`API error ${res.status} on ${path}`);
  return res.json() as Promise<T>;
}

export function getBuildingIdFromUrl(): number | null {
  const segment = window.location.pathname.split("/buildings/")[1];
  const parsed = Number(segment);
  return isNaN(parsed) ? null : parsed;
}

export const fetchAgencies = (): Promise<AgencyResponse[]> =>
  get<AgencyResponse[]>("/agencies");

export const fetchBuildingById = (buildingId: number): Promise<BuildingResponse> =>
  get<BuildingResponse>(`/buildings/${buildingId}`);

export const fetchBuildingsByAgency = (agencyId: number): Promise<BuildingResponse[]> =>
  get<BuildingResponse[]>(`/buildings/agency/${agencyId}`);

export const fetchBuildingPictures = (buildingId: number): Promise<BuildingPictureResponse[]> =>
  get<BuildingPictureResponse[]>(`/buildings/${buildingId}/pictures`);
