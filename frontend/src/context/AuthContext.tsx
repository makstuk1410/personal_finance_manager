import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";

import {
    login as loginRequest,
    getCurrentUser,
    exchangeOAuthCode,
} from "../services/authService";

type User = {
    userId: number;
};

type AuthContextType = {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    loginWithOAuthCode: (code: string) => Promise<void>;
    logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function checkAuthentication() {
            const token = localStorage.getItem("token");

            if (!token) {
                setIsLoading(false);
                return;
            }

            try {
                const currentUser = await getCurrentUser();
                setUser(currentUser);
            } catch {
                localStorage.removeItem("token");
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        }

        checkAuthentication();
    }, []);

    async function login(email: string, password: string) {
        const result = await loginRequest({
            email,
            password,
        });

        localStorage.setItem("token", result.token);

        const currentUser = await getCurrentUser();

        setUser(currentUser);
    }

    async function loginWithOAuthCode(code: string) {
        const result = await exchangeOAuthCode(code);

        localStorage.setItem("token", result.token);

        const currentUser = await getCurrentUser();
        setUser(currentUser);
    }

    function logout() {
        localStorage.removeItem("token");
        setUser(null);
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: user !== null,
                isLoading,
                login,
                loginWithOAuthCode,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }

    return context;
}