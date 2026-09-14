import { useState } from "react";
import { register } from "../services/authService";
import { Link, useNavigate } from "react-router-dom";
import "./RegisterPage.css";

export default function RegisterPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");

    const navigate = useNavigate();

    async function handleRegister(event: React.FormEvent) {
        event.preventDefault();

        try {
            await register({
                email,
                password,
                passwordConfirmation,
            });

            navigate("/login");
        } catch (error) {
            console.error(error);
            alert(
                error instanceof Error
                    ? error.message
                    : "Registration failed"
            );
        }
    }

    return (
        <div className="register-page">
            <header className="register-header">
                <Link to="/" className="register-logo">
                    <span className="register-logo-icon">
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

            <main className="register-main">
                <section className="register-form-container">
                    <h1>Register</h1>

                    <form onSubmit={handleRegister}>
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

                        <input
                            type="password"
                            placeholder="Enter password"
                            value={passwordConfirmation}
                            onChange={(e) =>
                                setPasswordConfirmation(e.target.value)
                            }
                            required
                        />

                        <p className="register-login">
                            Already have an account?{" "}
                            <Link to="/login">
                                Login now
                            </Link>
                        </p>

                        <button type="submit">
                            Register
                        </button>
                    </form>
                </section>
            </main>

            <footer className="register-footer">
                Personal Finance Manager&nbsp; © 2026 Personal Finance Manager
            </footer>
        </div>
    );
}