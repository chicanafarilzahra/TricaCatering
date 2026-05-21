// resources/js/components/NavbarOwner.jsx

import {
    Bell,
    UserCircle,
} from "lucide-react";

export default function NavbarOwner() {
    const user = JSON.parse(
        localStorage.getItem("user")
    );

    return (
        <div
            style={{
                height: "80px",
                display: "flex",
                alignItems: "center",
                justifyContent:
                    "space-between",
                padding: "0 32px",
                borderBottom:
                    "1px solid rgba(255,255,255,0.06)",
                background:
                    "rgba(15,23,42,0.85)",
                backdropFilter:
                    "blur(12px)",
                position: "sticky",
                top: 0,
                zIndex: 100,
            }}
        >
            {/* LEFT */}
            <div>
                <h1
                    style={{
                        margin: 0,
                        fontSize: "26px",
                        fontWeight: "700",
                        color: "white",
                    }}
                >
                    Owner Dashboard
                </h1>

                <p
                    style={{
                        margin:
                            "4px 0 0",
                        fontSize: "13px",
                        color:
                            "#94a3b8",
                    }}
                >
                    Welcome back,{" "}
                    {user?.name}
                </p>
            </div>

            {/* RIGHT */}
            <div
                style={{
                    display: "flex",
                    alignItems:
                        "center",
                    gap: "18px",
                }}
            >
                {/* Notification */}
                <div
                    style={{
                        width: "42px",
                        height: "42px",
                        borderRadius:
                            "14px",
                        background:
                            "rgba(255,255,255,0.05)",
                        display:
                            "flex",
                        alignItems:
                            "center",
                        justifyContent:
                            "center",
                        color:
                            "#cbd5e1",
                        cursor:
                            "pointer",
                    }}
                >
                    <Bell size={18} />
                </div>

                {/* User */}
                <div
                    style={{
                        display:
                            "flex",
                        alignItems:
                            "center",
                        gap: "10px",
                        padding:
                            "6px 12px",
                        borderRadius:
                            "14px",
                        background:
                            "rgba(255,255,255,0.04)",
                    }}
                >
                    <UserCircle
                        size={28}
                        color="#e2e8f0"
                    />

                    <div>
                        <div
                            style={{
                                color:
                                    "white",
                                fontSize:
                                    "14px",
                                fontWeight:
                                    "600",
                            }}
                        >
                            {
                                user?.name
                            }
                        </div>

                        <div
                            style={{
                                color:
                                    "#94a3b8",
                                fontSize:
                                    "11px",
                                textTransform:
                                    "capitalize",
                            }}
                        >
                            {
                                user?.role
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}