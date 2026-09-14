import { Link } from "react-router-dom";
import "./LandingPage.css";
import budgetsPreview from "../images/budgets-preview.png";
import dashboardPreview from "../images/dashboard-preview.png";
import goalsPreview from "../images/goals-preview.png";
import simulationPreview from "../images/simulation-preview.png";
import transactionsPreview from "../images/transactions-preview.png.png";

export default function LandingPage() {
    return (
        <div className="landing-page">
            <header className="landing-header">
                <div className="container header-content">
                    <Link to="/" className="logo">
                        Personal Finance Manager
                    </Link>

                    <nav className="header-actions">
                        <Link to="/login" className="login-link">
                            Log in
                        </Link>

                        <Link to="/register" className="primary-button">
                            Get started
                        </Link>
                    </nav>
                </div>
            </header>

            <main>
                <section className="hero">
                    <div className="container hero-content">
                        <div className="hero-text">
                            <h1>
                                Take control of your finances.
                            </h1>

                            <p className="hero-subtitle">
                                Track. Analyze. Plan.
                                <br />
                                Simulate your financial future.
                            </p>

                            <Link to="/register" className="primary-button hero-button">
                                Get started
                            </Link>
                        </div>

                        <div className="hero-preview">
                            <img
                                src={dashboardPreview}
                                alt="Personal Finance Manager dashboard"
                            />
                        </div>
                    </div>
                </section>

                <section className="feature-section">
                    <div className="container feature-content">
                        <div className="feature-preview">
                            <img
                                src={transactionsPreview}
                                alt="Transactions"
                            />
                        </div>

                        <div className="feature-text">
                            <h2>Track your finances.</h2>
                            <p>
                                Easily record and manage your income and expenses in one place.
                            </p>
                        </div>
                    </div>
                </section>

                <section className="feature-section">
                    <div className="container feature-content reverse">
                        <div className="feature-text">
                            <h2>Plan your spending.</h2>
                            <p>
                                Create budgets and keep track of your spending.
                            </p>
                        </div>

                        <div className="feature-preview">
                            <img
                                src={budgetsPreview}
                                alt="Budgets"
                            />
                        </div>
                    </div>
                </section>

                <section className="feature-section">
                    <div className="container feature-content">
                        <div className="feature-preview">
                            <img
                                src={goalsPreview}
                                alt="goals-preview"
                            />
                        </div>

                        <div className="feature-text">
                            <h2>Create new goals.</h2>
                            <p>
                                Track your progress over time.
                            </p>
                        </div>
                    </div>
                </section>

                <section className="simulation-section">
                    <div className="container simulation-content">
                        <div className="simulation-text">
                            <h2>Simulate your financial future.</h2>

                            <p>
                                Explore hypothetical financial decisions and see how they
                                could affect your balance and savings.
                            </p>
                        </div>

                        <div className="simulation-preview">
                            <img
                                src={simulationPreview}
                                alt="simulation"
                            />
                        </div>
                    </div>
                </section>

                <section className="final-cta">
                    <div className="container">
                        <h2>Ready to take control?</h2>

                        <Link to="/register" className="primary-button">
                            Get started
                        </Link>
                    </div>
                </section>
            </main>

            <footer>
                Personal Finance Manager © 2026
            </footer>
        </div>
    );
}