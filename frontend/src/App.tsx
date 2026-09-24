import { BrowserRouter, Routes, Route } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import OAuthCallbackPage from "./pages/OAuthCallbackPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";

import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthenticatedLayout from "./layouts/AuthenticatedLayout";

import AccountsPage from "./pages/AccountsPage";
import TransactionsPage from "./pages/TransactionsPage";
import BudgetsPage from "./pages/BudgetsPage";
import SavingsGoalsPage from "./pages/SavingsGoalsPage";
import SimulationsPage from "./pages/SimulationsPage";

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/oauth-callback" element={<OAuthCallbackPage />} />
                    <Route path="/register" element={<RegisterPage />} />

                    <Route element={<ProtectedRoute />}>
                        <Route element={<AuthenticatedLayout />}>
                            <Route
                                path="/dashboard"
                                element={<DashboardPage />}
                            />

                            <Route
                                path="/accounts"
                                element={<AccountsPage />}
                            />

                            <Route
                                path="/transactions"
                                element={<TransactionsPage />}
                            />

                            <Route
                                path="/budgets"
                                element={<BudgetsPage />}
                            />

                            <Route
                                path="/savings-goals"
                                element={<SavingsGoalsPage />}
                            />

                            <Route
                                path="/simulations"
                                element={<SimulationsPage />}
                            />
                        </Route>
                    </Route>
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;