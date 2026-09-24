import { API_URL } from "./api";

export interface RegisterRequest {
    email: string;
    password: string;
    passwordConfirmation: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export async function register(
    request: RegisterRequest
) {
    const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
    });

    if (!response.ok) {
        throw new Error(await response.text());
    }

    return response.json();
}

export async function login(request: LoginRequest) {
    const response = await fetch(
        `${API_URL}/auth/login`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(request),
        }
    );

    if (!response.ok) {
        throw new Error(await response.text());
    }

    return response.json();
}

export async function exchangeOAuthCode(code: string) {
    const response = await fetch(
        `${API_URL}/auth/oauth/exchange`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ code }),
        }
    );

    if (!response.ok) {
        throw new Error(await response.text());
    }

    return response.json() as Promise<{ token: string }>;
}

export async function getCurrentUser() {
    const token = localStorage.getItem("token");

    const response = await fetch(
        `${API_URL}/auth/me`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    if (!response.ok) {
        throw new Error(await response.text());
    }

    return response.json();
}