export interface Category {
    id: number;
    name: string;
    isDefault: boolean;
}

const API_URL = "http://localhost:8080/api/categories";

async function categoryRequest<T>(options: RequestInit): Promise<T> {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Please sign in to manage categories.");

    const response = await fetch(API_URL, {
        ...options,
        headers: {
            Authorization: `Bearer ${token}`,
            ...(options.body ? { "Content-Type": "application/json" } : {}),
        },
    });

    if (!response.ok) {
        if (response.status === 401) {
            throw new Error("Your session has expired. Please sign in again.");
        }
        const text = await response.text();
        let message = text;
        try {
            const error = JSON.parse(text);
            message = typeof error === "string" ? error :
                error.errors ? Object.values(error.errors).flat().join(" ") : error.title;
        } catch {
            // Controller errors may be plain text instead of Problem Details.
        }
        throw new Error(message || "Unable to load or save categories. Please try again.");
    }

    return response.json();
}

export function getCategories(signal?: AbortSignal): Promise<Category[]> {
    return categoryRequest({ method: "GET", signal });
}

export function createCategory(name: string): Promise<Category> {
    return categoryRequest({ method: "POST", body: JSON.stringify({ name: name.trim() }) });
}
