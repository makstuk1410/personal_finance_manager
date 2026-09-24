import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

export default function OAuthCallbackPage() {
    const [searchParams] = useSearchParams();
    const [error, setError] = useState<string | null>(null);
    const hasExchangedCode = useRef(false);
    const { loginWithOAuthCode } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (hasExchangedCode.current) {
            return;
        }

        const code = searchParams.get("code");

        if (!code) {
            setError("The Google login response was incomplete.");
            return;
        }

        hasExchangedCode.current = true;
        loginWithOAuthCode(code)
            .then(() => navigate("/dashboard", { replace: true }))
            .catch(() => setError("Google login failed. Please try again."));
    }, [loginWithOAuthCode, navigate, searchParams]);

    return (
        <main>
            {error ? (
                <>
                    <p>{error}</p>
                    <Link to="/login">Return to login</Link>
                </>
            ) : (
                <p>Signing you in...</p>
            )}
        </main>
    );
}