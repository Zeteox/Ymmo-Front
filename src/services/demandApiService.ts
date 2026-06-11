import type { ContactDemandResponse } from "../types/api";

const BASE_URL = import.meta.env.VITE_MAIN_API_URL;

export const demandApiService = {
    async addDemand(buildingId: string, data:{userId:number, content:string}) {
        await fetch(`${BASE_URL}/buildings/${buildingId}/demands`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify(data)
        })
        return
    },
    async getDemands(buildingId: string):Promise<ContactDemandResponse[]> {
        const response = await fetch(`${BASE_URL}/buildings/${buildingId}/demands`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
        })
        return response.json();
    },
    async getDemandById(buildingId: string, demandId:number):Promise<ContactDemandResponse> {
        const response = await fetch(`${BASE_URL}/buildings/${buildingId}/demands/${demandId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
        })
        return response.json();
    },
    async deleteDemand(buildingId: string, demandId: string) {
        await fetch(`${BASE_URL}/buildings/${buildingId}/demands/${demandId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
        })
        return
    }
}