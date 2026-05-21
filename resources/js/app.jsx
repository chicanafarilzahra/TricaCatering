// resources/js/app.jsx

import 'leaflet/dist/leaflet.css';
import React from "react";
import ReactDOM from "react-dom/client";

import {
    HashRouter,
    Routes,
    Route,
} from "react-router-dom";

/* =========================
   PAGES
========================= */

import Dashboard from "./pages/Dashboard";
import Menus from "./pages/Menus";
import Packages from "./pages/Packages";
import Orders from "./pages/Orders";
import Productions from "./pages/Productions";
import SPPG from "./pages/SPPG";
import Couriers from "./pages/Couriers";
import Deliveries from "./pages/Deliveries";
import Customers from "./pages/Customers";
import Reports from "./pages/Reports";
import Stocks from "./pages/Stocks";

import Login from "./pages/Login";
import Register from "./pages/Register";

/* =========================
   OWNER PAGES
========================= */

import DashboardOwner from "./pages/owner/DashboardOwner";
import OrdersOwner from "./pages/owner/OrdersOwner";
import CustomersOwner from "./pages/owner/CustomersOwner";
import MenusOwner from "./pages/owner/MenusOwner";
import PackagesOwner from "./pages/owner/PackagesOwner";
import ProductionsOwner from "./pages/owner/ProductionsOwner";
import StocksOwner from "./pages/owner/StocksOwner";
import CouriersOwner from "./pages/owner/CouriersOwner";
import DeliveriesOwner from "./pages/owner/DeliveriesOwner";
import RevenueOwner from "./pages/owner/RevenueOwner";
import ReportsOwner from "./pages/owner/ReportsOwner";

/* =========================
   KURIR
========================= */

import KurirHome from "./pages/Kurir/Home";
import JadwalPengiriman from "./pages/Kurir/JadwalPengiriman";
import PengirimanAktif from "./pages/Kurir/PengirimanAktif";
import RuteHariIni from "./pages/Kurir/RuteHariIni";
import LaporanHarian from "./pages/Kurir/LaporanHarian";

/* =========================
   COMPONENTS
========================= */

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
    return (
        <HashRouter>
            <Routes>

                {/* =========================
                    LOGIN DAN REGISTER
                ========================= */}

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />

                {/* =========================
                    DASHBOARD
                ========================= */}

                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />

                {/* =========================
                    ADMIN
                ========================= */}

                <Route
                    path="/menus"
                    element={
                        <ProtectedRoute>
                            <Menus />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/packages"
                    element={
                        <ProtectedRoute>
                            <Packages />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/orders"
                    element={
                        <ProtectedRoute>
                            <Orders />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/productions"
                    element={
                        <ProtectedRoute>
                            <Productions />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/sppg"
                    element={
                        <ProtectedRoute>
                            <SPPG />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/couriers"
                    element={
                        <ProtectedRoute>
                            <Couriers />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/deliveries"
                    element={
                        <ProtectedRoute>
                            <Deliveries />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/customers"
                    element={
                        <ProtectedRoute>
                            <Customers />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/reports"
                    element={
                        <ProtectedRoute>
                            <Reports />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/stocks"
                    element={
                        <ProtectedRoute>
                            <Stocks />
                        </ProtectedRoute>
                    }
                />

                {/* =========================
   OWNER
   (TIDAK ADA SPPG)
========================= */}

<Route
    path="/owner"
    element={
        <ProtectedRoute role="owner">
            <DashboardOwner />
        </ProtectedRoute>
    }
/>

<Route
    path="/owner/orders"
    element={
        <ProtectedRoute role="owner">
            <OrdersOwner />
        </ProtectedRoute>
    }
/>

<Route
    path="/owner/customers"
    element={
        <ProtectedRoute role="owner">
            <CustomersOwner />
        </ProtectedRoute>
    }
/>

<Route
    path="/owner/menus"
    element={
        <ProtectedRoute role="owner">
            <MenusOwner />
        </ProtectedRoute>
    }
/>

<Route
    path="/owner/packages"
    element={
        <ProtectedRoute role="owner">
            <PackagesOwner />
        </ProtectedRoute>
    }
/>

<Route
    path="/owner/productions"
    element={
        <ProtectedRoute role="owner">
            <ProductionsOwner />
        </ProtectedRoute>
    }
/>

<Route
    path="/owner/stocks"
    element={
        <ProtectedRoute role="owner">
            <StocksOwner />
        </ProtectedRoute>
    }
/>

<Route
    path="/owner/couriers"
    element={
        <ProtectedRoute role="owner">
            <CouriersOwner />
        </ProtectedRoute>
    }
/>

<Route
    path="/owner/deliveries"
    element={
        <ProtectedRoute role="owner">
            <DeliveriesOwner />
        </ProtectedRoute>
    }
/>

<Route
    path="/owner/revenue"
    element={
        <ProtectedRoute role="owner">
            <RevenueOwner />
        </ProtectedRoute>
    }
/>

<Route
    path="/owner/reports"
    element={
        <ProtectedRoute role="owner">
            <ReportsOwner />
        </ProtectedRoute>
    }
/>
                {/* =========================
                    KURIR
                ========================= */}

                <Route
                    path="/kurir"
                    element={
                        <ProtectedRoute role="kurir">
                            <KurirHome />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/kurir/jadwal"
                    element={
                        <ProtectedRoute role="kurir">
                            <JadwalPengiriman />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/kurir/aktif"
                    element={
                        <ProtectedRoute role="kurir">
                            <PengirimanAktif />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/kurir/rute"
                    element={
                        <ProtectedRoute role="kurir">
                            <RuteHariIni />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/kurir/laporan"
                    element={
                        <ProtectedRoute role="kurir">
                            <LaporanHarian />
                        </ProtectedRoute>
                    }
                />

            </Routes>
        </HashRouter>
    );
}

const root = ReactDOM.createRoot(
    document.getElementById("root")
);

root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);