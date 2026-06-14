import type { AuthResponse } from "../types/api";

const BASE_URL = import.meta.env.VITE_MAIN_API_URL ?? "/api";

export const AuthApiService = {
    async register(firstName: string, lastName: string, email: string, phone: string, password: string, agencyId:number):Promise<AuthResponse> {
        const response = await fetch(BASE_URL+"/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ firstName, lastName, email, phone, password, agencyId })
        })
        const data:AuthResponse = await response.json()
        if (response.status == 200) {
            localStorage.setItem("token", data.token)
        }
        return data
    },
    async login(email: string, password: string) {
        const response = await fetch(BASE_URL+"/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        })
        const data:AuthResponse = await response.json()
        if (response.status == 200) {
            localStorage.setItem("token", data.token)
        }
        return data
    },
}
