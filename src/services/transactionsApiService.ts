const BASE_URL = import.meta.env.VITE_MAIN_API_URL ?? "/api";

import type { TransactionResponse } from "../types/api"
import type { TransactionPayload } from "../types/utils";

export const transactionApiService = {
    async getTransactions(): Promise<TransactionResponse[]> {
        const response = await fetch(`${BASE_URL}/transactions`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
        })
        return response.json()
    },
    async createTransaction(payload:TransactionPayload):Promise<TransactionResponse> {
        const response = await fetch(`${BASE_URL}/transactions`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify(payload)
        })
        return response.json()

    }
}
