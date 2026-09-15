import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
    Bell,
    ChevronDown,
    LogOut,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

const pageTitles: Record<string, string> = {
    "/dashboard": "Dashboard",
    "/accounts": "Accounts",
    "/transactions": "Transactions",
    "/budgets": "Budgets",
    "/statistics": "Statistics",
    "/savings-goals": "Saving Goals",
    "/simulations": "What-If Simulator",
};

export default function Header() {
    const location = useLocation();
    const navigate = useNavigate();

    const { logout } = useAuth();

    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

    const pageTitle =
        pageTitles[location.pathname] ?? "Personal Finance";

    function handleLogout() {
        logout();
        navigate("/", { replace: true });
    }

    return (
        <header className="header">
            <h1 className="header-title">
                {pageTitle}
            </h1>

            <div className="header-actions">
                <button
                    type="button"
                    className="header-icon-button"
                    aria-label="Notifications"
                >
                    <Bell size={20} strokeWidth={1.8} />
                </button>

                <div className="profile-menu">
                    <button
                        type="button"
                        className="header-profile-button"
                        onClick={() =>
                            setIsProfileMenuOpen((value) => !value)
                        }
                        aria-label="Open profile menu"
                        aria-expanded={isProfileMenuOpen}
                    >
                        <div className="header-avatar">
                        </div>

                        <ChevronDown
                            size={18}
                            strokeWidth={1.8}
                        />
                    </button>

                    {isProfileMenuOpen && (
                        <div className="profile-dropdown">
                            <button
                                type="button"
                                className="profile-dropdown-item"
                                onClick={handleLogout}
                            >
                                <LogOut
                                    size={16}
                                    strokeWidth={1.8}
                                />

                                <span>Logout</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}