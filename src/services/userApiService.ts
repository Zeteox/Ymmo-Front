import type { UserResponse } from "../types/api";

const BASE_URL = import.meta.env.VITE_MAIN_API_URL;

export const userApiService = {
    async getMe():Promise<UserResponse> {
        const response = await fetch(BASE_URL + "/users/me", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
        })
        if (response.status === 401) {
            localStorage.removeItem("token")
            window.location.replace("/login")
        }
        return await response.json()
    },
}