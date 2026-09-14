import { Link } from "react-router-dom";

export default function LandingPage() {
    return (
        <div>
            <h1>Personal Finance Manager</h1>

            <Link to="/login">
                Log in
            </Link>

            <Link to="/register">
                Get started
            </Link>
        </div>
    );
}