export type TransactionType = "Income" | "Expense" | "Transfer";
export interface TransactionInput {
    type: TransactionType;
    amount: number;
    date: string;
    description: string;
    sourceAccountId: number | null;
    destinationAccountId: number | null;
    categoryId: number | null;
}
export interface Transaction extends TransactionInput { id: number; }
export interface AccountOption { id: number; name: string; currency: string; balance: number; }

async function request<T>(path: string, method = "GET", body?: TransactionInput): Promise<T> {
    const response = await fetch(`http://localhost:8080/api/${path}`, {
        method,
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}`,
            ...(body ? { "Content-Type": "application/json" } : {}) },
        ...(body ? { body: JSON.stringify(body) } : {}),
    });
    if (!response.ok) {
        if (response.status === 401) throw new Error("Your session has expired. Please sign in again.");
        const text = await response.text();
        let message = text;
        try {
            const error = JSON.parse(text);
            message = typeof error === "string" ? error :
                error.errors ? Object.values(error.errors).flat().join(" ") : error.title;
        } catch { /* The API also returns plain text errors. */ }
        throw new Error(message || "The request failed. Please try again.");
    }
    return response.status === 204 ? undefined as T : response.json();
}

export const getAccounts = () => request<AccountOption[]>("accounts");
export const getTransactions = () => request<Transaction[]>("transactions");
export const saveTransaction = (data: TransactionInput, id?: number) =>
    request<Transaction | void>(id === undefined ? "transactions" : `transactions/${id}`, id === undefined ? "POST" : "PUT", data);
export const deleteTransaction = (id: number) => request<void>(`transactions/${id}`, "DELETE");
