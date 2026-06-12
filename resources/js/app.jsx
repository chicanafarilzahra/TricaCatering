// resources/js/app.jsx

import "leaflet/dist/leaflet.css";

import React from "react";
import ReactDOM from "react-dom/client";

import {
    HashRouter,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";

/* =========================
   ADMIN PAGES
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
import AdminValidasiUser from "./pages/AdminValidasiUser";

/* =========================
   AUTH
========================= */

import Login from "./pages/Login";
import Register from "./pages/Register";
import LandingPage from "./pages/LandingPage";

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
   KLIEN
========================= */

import HomeKlien from "./pages/Klien/Home";
import PesananSaya from "./pages/Klien/PesananSaya";
import PesanMakan from "./pages/Klien/PesanMakan";
import Tracking from "./pages/Klien/Tracking";
import InvoiceKlien from "./pages/Klien/InvoiceKlien";
import UlasanKlien from "./pages/Klien/UlasanKlien";


/* =========================
   SPPG
========================= */

import DashboardSPPG from "./pages/sppg/DashboardSPPG";
import MenuHarianSPPG from "./pages/sppg/MenuHarianSPPG";
import SekolahSPPG from "./pages/sppg/SekolahSPPG";
import DistribusiSPPG from "./pages/sppg/DistribusiSPPG";

/* =========================
   COMPONENTS
========================= */

import ProtectedRoute from "./components/ProtectedRoute";

function App() {

    const token =
        localStorage.getItem("token");

    return (

        <HashRouter>

            <Routes>

                {/* =========================
                    AUTO REDIRECT
                ========================= */}
                <Route
                    path="/"
                    element={<LandingPage />}
                />

                {/* =========================
                    LOGIN & REGISTER
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
                    ADMIN
                ========================= */}

                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />

               <Route
                    path="/admin-validasi-user"
                    element={<AdminValidasiUser />}
                />

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
                    path="/admin/sppg"
                    element={
                        <ProtectedRoute role="admin">
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

                {/* =========================
                        KLIEN
                    ========================= */}

                    <Route
                        path="/klien"
                        element={
                            <ProtectedRoute role="klien">
                                <HomeKlien />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/klien/pesan"
                        element={
                            <ProtectedRoute role="klien">
                                <PesanMakan />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/klien/pesanan"
                        element={
                            <ProtectedRoute role="klien">
                                <PesananSaya />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/klien/lacak-pengiriman"
                        element={
                            <ProtectedRoute role="klien">
                                <Tracking />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/klien/invoice"
                        element={
                            <ProtectedRoute role="klien">
                                <InvoiceKlien />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/klien/ulasan"
                        element={
                            <ProtectedRoute role="klien">
                                <UlasanKlien />
                            </ProtectedRoute>
                        }
                    />

                    {/* =========================
                        SPPG
                    ========================= */}
                    <Route
                        path="/sppg/dashboard"
                        element={
                            <ProtectedRoute role="operator_sppg">
                                <DashboardSPPG />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/sppg/menu-harian"
                        element={
                            <ProtectedRoute role="operator_sppg">
                                <MenuHarianSPPG />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/sppg/sekolah"
                        element={
                            <ProtectedRoute role="operator_sppg">
                                <SekolahSPPG />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/sppg/distribusi"
                        element={<DistribusiSPPG />}
                    />
                    
                {/* =========================
                    404 REDIRECT
                ========================= */}

                <Route
                    path="/"
                    element={<LandingPage />}
                />
            </Routes>

        </HashRouter>
    );
}

const container =
    document.getElementById("root");

if (!window.__root) {
    window.__root =
        ReactDOM.createRoot(container);
}

window.__root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);