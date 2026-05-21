// resources/js/components/NavbarKurir.jsx

import { FaBell } from "react-icons/fa";

export default function NavbarKurir({ title }) {
    return (
        <div
            style={{
                width: "100%",
                height: "78px",
                margin: 0,
                padding: "0 30px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background:
                    "linear-gradient(90deg,#17306a 0%,#1f3f8b 100%)",
                borderBottom:
                    "1px solid rgba(255,255,255,0.05)",
                boxShadow:
                    "0 4px 18px rgba(0,0,0,0.25)",
                position: "sticky",
                top: 0,
                zIndex: 100,
            }}
        >
            {/* TITLE */}
            <div>
                <h1
                    style={{
                        color: "#ffffff",
                        fontSize: "28px",
                        fontWeight: "700",
                        letterSpacing: "0.3px",
                    }}
                >
                    {title}
                </h1>
            </div>

            {/* RIGHT */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "18px",
                }}
            >
                <div
                    style={{
                        width: "42px",
                        height: "42px",
                        borderRadius: "12px",
                        background:
                            "rgba(255,255,255,0.08)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                    }}
                >
                    <FaBell
                        style={{
                            color: "#ffffff",
                            fontSize: "18px",
                        }}
                    />
                </div>
            </div>
        </div>
    );
}