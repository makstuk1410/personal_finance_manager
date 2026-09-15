import { Outlet } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Footer from "../components/Footer";

import "./AuthenticatedLayout.css";

export default function AuthenticatedLayout() {
    return (
        <div className="authenticated-layout">
            <Sidebar />

            <div className="authenticated-content">
                <Header />

                <main className="authenticated-main">
                    <Outlet />
                </main>

                <Footer />
            </div>
        </div>
    );
}