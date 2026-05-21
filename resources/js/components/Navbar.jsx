// resources/js/components/Navbar.jsx

import {
    Bell,
    Search,
    Calendar,
} from "lucide-react";

export default function Navbar() {

    const user = JSON.parse(
        localStorage.getItem("user")
    );

    return (

        <div
            style={{

                height: "84px",

                padding: "0 34px",

                display: "flex",

                alignItems: "center",

                justifyContent:
                    "space-between",

                position: "sticky",

                top: 0,

                zIndex: 100,

                backdropFilter:
                    "blur(18px)",

                background:
                    "rgba(2,6,23,0.75)",

                borderBottom:
                    "1px solid rgba(255,255,255,0.05)",
            }}
        >

            {/* LEFT */}
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                }}
            >

                <div
                    style={{
                        color: "white",

                        fontSize: "30px",

                        fontWeight: "700",

                        lineHeight: "1",
                    }}
                >
                    Welcome back,
                    {" "}
                    {user?.name}
                    
                </div>

                <div
                    style={{
                        marginTop: "10px",

                        display: "flex",

                        alignItems: "center",

                        gap: "8px",

                        color: "#94a3b8",

                        fontSize: "13px",
                    }}
                >

                    <Calendar size={15} />

                    {
                        new Date().toLocaleDateString(
                            "id-ID",
                            {
                                weekday: "long",
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                            }
                        )
                    }

                </div>

            </div>

            {/* RIGHT */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                }}
            >

                {/* SEARCH */}
                <div
                    style={{

                        width: "380px",

                        height: "54px",

                        borderRadius: "18px",

                        background:
                            "rgba(255,255,255,0.04)",

                        border:
                            "1px solid rgba(255,255,255,0.05)",

                        display: "flex",

                        alignItems: "center",

                        padding: "0 18px",

                        gap: "14px",
                    }}
                >

                    <Search
                        size={19}
                        color="#94a3b8"
                    />

                    <input
                        type="text"
                        placeholder="Search anything..."
                        style={{

                            flex: 1,

                            background:
                                "transparent",

                            border: "none",

                            outline: "none",

                            color: "white",

                            fontSize: "14px",
                        }}
                    />

                </div>

                {/* NOTIF */}
                <div
                    style={{

                        width: "54px",

                        height: "54px",

                        borderRadius: "18px",

                        background:
                            "rgba(255,255,255,0.04)",

                        border:
                            "1px solid rgba(255,255,255,0.05)",

                        display: "flex",

                        alignItems: "center",

                        justifyContent: "center",

                        position: "relative",

                        cursor: "pointer",
                    }}
                >

                    <Bell
                        size={20}
                        color="white"
                    />

                    <div
                        style={{
                            width: "9px",
                            height: "9px",

                            borderRadius:
                                "999px",

                            background:
                                "#8b5cf6",

                            position:
                                "absolute",

                            top: "15px",
                            right: "15px",
                        }}
                    />

                </div>

                {/* PROFILE */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "14px",
                    }}
                >

                    <div
                        style={{
                            textAlign: "right",
                        }}
                    >

                        <div
                            style={{
                                color: "white",
                                fontWeight: "600",
                                fontSize: "14px",
                            }}
                        >
                            {user?.name}
                        </div>

                        <div
                            style={{
                                color: "#94a3b8",
                                fontSize: "12px",
                                marginTop: "4px",
                                textTransform:
                                    "capitalize",
                            }}
                        >
                            {user?.role}
                        </div>

                    </div>

                    <div
                        style={{

                            width: "54px",

                            height: "54px",

                            borderRadius: "18px",

                            background:
                                "linear-gradient(135deg,#6366f1,#8b5cf6)",

                            display: "flex",

                            alignItems: "center",

                            justifyContent: "center",

                            color: "white",

                            fontWeight: "700",

                            fontSize: "18px",

                            boxShadow:
                                "0 10px 30px rgba(99,102,241,0.35)",
                        }}
                    >
                        {
                            user?.name
                                ?.charAt(0)
                                ?.toUpperCase()
                        }
                    </div>

                </div>

            </div>

        </div>
    );
}