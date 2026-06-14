import type { BuildingPictureResponse } from "../types/api";

const BASE_URL = import.meta.env.VITE_MAIN_API_URL ?? "/api";

function authHeaders(): HeadersInit {
  return {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  };
}

export const pictureApiService = {
  async uploadPicture(buildingId: number, file: File): Promise<BuildingPictureResponse> {
    const formData = new FormData();
    formData.append("picture", file);

    const res = await fetch(`${BASE_URL}/buildings/${buildingId}/pictures`, {
      method: "POST",
      headers: authHeaders(),
      body: formData,
    });
    if (!res.ok) throw new Error(`Upload failed: ${res.status}`);
    return res.json();
  },

  async getPicture(buildingId: number, pictureId: number): Promise<BuildingPictureResponse> {
    const res = await fetch(`${BASE_URL}/buildings/${buildingId}/pictures/${pictureId}`, {
      headers: authHeaders(),
    });
    if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
    return res.json();
  },

  async getPictures(buildingId: number): Promise<BuildingPictureResponse[]> {
    const res = await fetch(`${BASE_URL}/buildings/${buildingId}/pictures`, {
      headers: authHeaders(),
    });
    if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
    return res.json();
  },

  async deletePicture(buildingId: number, pictureId: number): Promise<void> {
    const res = await fetch(`${BASE_URL}/buildings/${buildingId}/pictures/${pictureId}`, {
      method: "DELETE",
      headers: authHeaders(),
    });
    if (!res.ok) throw new Error(`Delete failed: ${res.status}`);
  },
};
