import { useState } from "react";
import { register } from "../services/authService";
import { Link } from "react-router-dom";

export default function RegisterPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");

    async function handleSubmit(
        event: React.FormEvent
    ) {
        event.preventDefault();

        try {
            await register({
                email,
                password,
                passwordConfirmation,
            });

            alert("Registration successful");
        } catch (error) {
            console.error(error);
            alert(error instanceof Error ? error.message : "Registration failed");
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <h1>Register</h1>

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

            <input
                type="password"
                placeholder="Confirm password"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
            />

            <p>
                Already have an account?{" "}
                <Link to="/login">
                    Login now
                </Link>
            </p>

            <button type="submit">
                Register
            </button>
        </form>
    );
}