import { useAuth } from "../context/AuthContext";

export default function DashboardPage() {
    const {
        user,
        isAuthenticated,
        isLoading,
    } = useAuth();

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
        </div>
    );
}