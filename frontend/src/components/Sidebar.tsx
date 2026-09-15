import { NavLink } from "react-router-dom";

const navigationItems = [
    {
        label: "Dashboard",
        path: "/dashboard",
    },
    {
        label: "Accounts",
        path: "/accounts",
    },
    {
        label: "Transactions",
        path: "/transactions",
    },
    {
        label: "Budgets",
        path: "/budgets",
    },
    {
        label: "Saving Goals",
        path: "/savings-goals",
    },
    {
        label: "What-If Simulator",
        path: "/simulations",
    },
];

export default function Sidebar() {
    return (
        <aside className="sidebar">
            <div className="sidebar-logo">
                <div className="sidebar-logo-icon">
                    P
                </div>

                <span>Personal Finance</span>
            </div>

            <nav className="sidebar-navigation">
                {navigationItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `sidebar-link ${isActive ? "active" : ""}`
                        }
                    >
                        <span className="sidebar-link-icon">
                            □
                        </span>

                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
}