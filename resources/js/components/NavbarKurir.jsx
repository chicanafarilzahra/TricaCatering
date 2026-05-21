// resources/js/components/NavbarKurir.jsx

import { FaBell } from "react-icons/fa";

export default function NavbarKurir({
    title,
}) {
    return (
        <div
            style={{
                width: "100%",

                minHeight: "72px",

                display: "flex",

                alignItems: "center",

                justifyContent:
                    "space-between",

                padding:
                    "0 26px",

                boxSizing:
                    "border-box",

                background:
                    "linear-gradient(90deg,#17306a 0%,#1f3f8b 100%)",

                borderBottom:
                    "1px solid rgba(255,255,255,0.05)",

                boxShadow:
                    "0 4px 18px rgba(0,0,0,0.25)",

                overflow: "visible",

                flexShrink: 0,

                zIndex: 100,
            }}
        >
            {/* TITLE */}
            <h1
                style={{
                    margin: 0,

                    color: "#ffffff",

                    fontSize: "26px",

                    fontWeight: "700",

                    letterSpacing:
                        "0.3px",

                    whiteSpace:
                        "nowrap",
                }}
            >
                {title}
            </h1>

            {/* RIGHT */}
            <div
                style={{
                    display: "flex",

                    alignItems: "center",

                    flexShrink: 0,

                    marginLeft: "20px",
                }}
            >
                <div
                    style={{
                        width: "42px",

                        height: "42px",

                        minWidth: "42px",

                        borderRadius:
                            "12px",

                        background:
                            "rgba(255,255,255,0.10)",

                        display: "flex",

                        alignItems:
                            "center",

                        justifyContent:
                            "center",

                        cursor: "pointer",

                        flexShrink: 0,
                    }}
                >
                    <FaBell
                        size={16}
                        style={{
                            color:
                                "#ffffff",
                        }}
                    />
                </div>
            </div>
        </div>
    );
}