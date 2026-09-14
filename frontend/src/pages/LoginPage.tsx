import { useState } from "react";
import { login } from "../services/authService";
import { Link, useNavigate } from "react-router-dom";
import "./LoginPage.css";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    async function handleLogin(event: React.FormEvent) {
        event.preventDefault();

        try {
            const result = await login({
                email,
                password,
            });

            localStorage.setItem("token", result.token);

            navigate("/dashboard");
        } catch (error) {
            console.error(error);
            alert(error instanceof Error ? error.message : "Login failed");
        }
    }

    return (
        <div className="login-page">
            <header className="login-header">
                <Link to="/" className="login-logo">
                    <span className="login-logo-icon">
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <rect
                                x="3"
                                y="5"
                                width="18"
                                height="14"
                                rx="2"
                                stroke="currentColor"
                                strokeWidth="2"
                            />
                            <path
                                d="M3 9H21"
                                stroke="currentColor"
                                strokeWidth="2"
                            />
                            <path
                                d="M15 13H18"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                            />
                        </svg>
                    </span>

                    <span>Personal Finance</span>
                </Link>
            </header>

            <main className="login-main">
                <section className="login-form-container">
                    <h1>Login</h1>

                    <form onSubmit={handleLogin}>
                        <input
                            type="email"
                            placeholder="Enter email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />

                        <input
                            type="password"
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                        <p className="login-register">
                            Don't have account?{" "}
                            <Link to="/register">
                                Register now
                            </Link>
                        </p>

                        <button type="submit">
                            Login
                        </button>
                    </form>
                </section>
            </main>

            <footer className="login-footer">
                Personal Finance Manager&nbsp; © 2026 Personal Finance Manager
            </footer>
        </div>
    );
}