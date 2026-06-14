import type { UserResponse } from "../types/api";

const BASE_URL = import.meta.env.VITE_MAIN_API_URL ?? "/api";

export const userApiService = {
    async getMe():Promise<UserResponse | undefined> {
        if (!localStorage.getItem("token")) return undefined;
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
    async getUserById(userid:string):Promise<UserResponse | undefined> {
        const response = await fetch(BASE_URL + "/users/" + userid, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
        })
        if (response.status != 200) {
            console.error("couldnt fetch user by id: " + userid)
            return undefined;
        }
        return await response.json()
    },
}
