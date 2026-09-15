import { NavLink } from "react-router-dom";
import {
    LayoutDashboard,
    WalletCards,
    ArrowLeftRight,
    ChartNoAxesCombined,
    PiggyBank,
    FlaskConical,
} from "lucide-react";

const navigationItems = [
    {
        label: "Dashboard",
        path: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        label: "Accounts",
        path: "/accounts",
        icon: WalletCards,
    },
    {
        label: "Transactions",
        path: "/transactions",
        icon: ArrowLeftRight,
    },
    {
        label: "Budgets",
        path: "/budgets",
        icon: ChartNoAxesCombined,
    },
    {
        label: "Saving Goals",
        path: "/savings-goals",
        icon: PiggyBank,
    },
    {
        label: "What-If Simulator",
        path: "/simulations",
        icon: FlaskConical,
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
                {navigationItems.map((item) => {
                    const Icon = item.icon;

                    return (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.path === "/dashboard"}
                            className={({ isActive }) =>
                                `sidebar-link ${isActive ? "active" : ""}`
                            }
                        >
                            <Icon
                                className="sidebar-link-icon"
                                size={16}
                                strokeWidth={1.8}
                            />

                            <span>{item.label}</span>
                        </NavLink>
                    );
                })}
            </nav>
        </aside>
    );
}