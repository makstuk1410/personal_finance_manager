import { useState } from "react";
import { login, getCurrentUser } from "../services/authService";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    async function handleLogin() {
        try {
            const result = await login({
                email,
                password,
            });
            localStorage.setItem("token", result.token);
            console.log("Logged in");

            const user = await getCurrentUser();
            console.log("Current user:", user);
            alert(`Logged in as user ${user.userId}`);
        } catch (error) {
            console.error(error);
            alert(error instanceof Error ? error.message : "Login failed");
        }
    }

    return (
        <div>
            <h1>Login</h1>

            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <button onClick={handleLogin}>
                Login
            </button>
        </div>
    );
}