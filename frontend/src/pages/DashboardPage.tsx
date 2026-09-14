import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

export default function DashboardPage() {
    const {
        user,
        isAuthenticated,
        isLoading,
        logout,
    } = useAuth();

    const navigate = useNavigate();

    function handleLogout() {
        logout();
        navigate("/", { replace: true });
    }

    if (isLoading) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <h1>Dashboard</h1>

            <p>
                Authenticated:{" "}
                {isAuthenticated ? "Yes" : "No"}
            </p>

            {user && (
                <p>
                    User ID: {user.userId}
                </p>
            )}

            <button onClick={handleLogout}>
                Logout
            </button>
        </div>
    );
}