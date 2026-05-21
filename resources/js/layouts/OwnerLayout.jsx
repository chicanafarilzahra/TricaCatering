// resources/js/layouts/OwnerLayout.jsx

import SidebarOwner from "../components/SidebarOwner";
import NavbarOwner from "../components/NavbarOwner";

export default function OwnerLayout({ children }) {
    return (
        <div
            style={{
                display: "flex",
                minHeight: "100vh",

                /* Background sederhana, tidak terlalu ramai */
                backgroundColor: "#0f172a",
            }}
        >
            {/* =========================
                SIDEBAR OWNER
            ========================= */}
            <SidebarOwner />

            {/* =========================
                MAIN CONTENT
            ========================= */}
            <div
                style={{
                    flex: 1,
                    marginLeft: "285px",
                    minHeight: "100vh",
                    display: "flex",
                    flexDirection: "column",

                    /* Area konten sedikit lebih terang */
                    backgroundColor: "#111827",
                }}
            >
                {/* =========================
                    NAVBAR
                ========================= */}
                <div
                    style={{
                        position: "sticky",
                        top: 0,
                        zIndex: 100,

                        /* Clean glass effect */
                        background:
                            "rgba(17, 24, 39, 0.92)",
                        backdropFilter: "blur(12px)",
                        WebkitBackdropFilter:
                            "blur(12px)",

                        borderBottom:
                            "1px solid rgba(148,163,184,0.08)",
                    }}
                >
                    <NavbarOwner />
                </div>

                {/* =========================
                    PAGE CONTENT
                ========================= */}
                <main
                    style={{
                        flex: 1,
                        padding: "32px",
                        boxSizing: "border-box",
                        overflowX: "hidden",
                    }}
                >
                    {/* Card wrapper agar konten terlihat premium */}
                    <div
                        style={{
                            width: "100%",
                            minHeight:
                                "calc(100vh - 120px)",

                            background:
                                "rgba(15, 23, 42, 0.55)",

                            border:
                                "1px solid rgba(148,163,184,0.08)",

                            borderRadius: "28px",

                            padding: "32px",

                            boxSizing: "border-box",

                            boxShadow:
                                "0 20px 60px rgba(0,0,0,0.25)",
                        }}
                    >
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}