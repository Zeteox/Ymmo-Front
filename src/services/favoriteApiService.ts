import type { BuildingResponse, UserResponse } from "../types/api";
import { userApiService } from "./userApiService";

const BASE_URL = import.meta.env.VITE_MAIN_API_URL ?? "/api";

async function requireUser(): Promise<UserResponse> {
    const user = await userApiService.getMe();
    if (!user) {
        throw new Error("User is not authenticated");
    }
    return user;
}

export const favoriteApiService = {
    async addFavorite(buildingId:number) {
        const user = await requireUser();
        await fetch(BASE_URL+"/users/" + user.id + "/favorites/"+buildingId, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
        })
    },
    async removeFavorite(buildingId:number) {
        const user = await requireUser();
        await fetch(BASE_URL+"/users/" + user.id + "/favorites/"+buildingId, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
        })
    },
    async getFavorites():Promise<BuildingResponse[]> {
        const user = await requireUser();
        const response = await fetch(BASE_URL+"/users/" + user.id + "/favorites", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
        })

        return response.json();
    },
    async isFavorite(buildingId:number):Promise<boolean> {
        const favorites:BuildingResponse[] = await this.getFavorites();
        const isFav = favorites.some(fav => fav.id === buildingId);
        return isFav;
    },
}

