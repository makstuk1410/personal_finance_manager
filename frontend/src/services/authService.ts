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
    const response = await fetch("http://localhost:8080/api/auth/register", {
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
        "http://localhost:8080/api/auth/login",
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

export async function getCurrentUser() {
    const token = localStorage.getItem("token");

    const response = await fetch(
        "http://localhost:8080/api/auth/me",
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