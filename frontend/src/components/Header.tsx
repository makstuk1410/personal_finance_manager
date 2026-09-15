import { useLocation } from "react-router-dom";

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

    const pageTitle = pageTitles[location.pathname] ?? "Personal Finance";

    return (
        <header className="header">
            <h1 className="header-title">
                {pageTitle}
            </h1>

            <div className="header-actions">
                <button className="header-icon-button">
                    ♧
                </button>

                <div className="header-avatar">
                </div>

                <button className="header-profile-button">
                    ˅
                </button>
            </div>
        </header>
    );
}