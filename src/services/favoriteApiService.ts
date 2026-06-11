import type { BuildingResponse, UserResponse } from "../types/api";
import { userApiService } from "./userApiService";

const BASE_URL = import.meta.env.VITE_MAIN_API_URL;

export const favoriteApiService = {
    async addFavorite(buildingId:number) {
        const user:UserResponse = await userApiService.getMe();
        await fetch(BASE_URL+"/users/" + user.id + "/favorites/"+buildingId, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        })
    },
    async removeFavorite(buildingId:number) {
        const user:UserResponse = await userApiService.getMe();
        await fetch(BASE_URL+"/users/" + user.id + "/favorites/"+buildingId, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }
        })
    },
    async getFavorites():Promise<BuildingResponse[]> {
        const user:UserResponse = await userApiService.getMe();
        const response = await fetch(BASE_URL+"/users/" + user.id + "/favorites", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })

        return response.json();
    },
    async isFavorite(buildingId:number):Promise<boolean> {
        const favorites:BuildingResponse[] = await this.getFavorites();
        const isFav = favorites.some(fav => fav.id === buildingId);
        return isFav;
    },
}