export default function Modal({
    open,
    title,
    children,
    onClose,
}) {

    if (!open) return null;

    return (
        <div
            style={{
                position: "fixed",

                top: 0,
                left: 0,

                width: "100%",
                height: "100%",

                background:
                    "rgba(15,23,42,0.55)",

                display: "flex",

                alignItems:
                    "center",

                justifyContent:
                    "center",

                zIndex: 999,
            }}
        >

            <div
                style={{
                    width: "500px",

                    background:
                        "white",

                    borderRadius:
                        "24px",

                    padding:
                        "26px",
                }}
            >

                {/* HEADER */}
                <div
                    style={{
                        display: "flex",

                        justifyContent:
                            "space-between",

                        alignItems:
                            "center",

                        marginBottom:
                            "24px",
                    }}
                >

                    <h2
                        style={{
                            margin: 0,

                            fontSize:
                                "22px",

                            color:
                                "#0f172a",
                        }}
                    >
                        {title}
                    </h2>

                    <button
                        onClick={onClose}
                        style={{
                            border:
                                "none",

                            background:
                                "transparent",

                            fontSize:
                                "22px",

                            cursor:
                                "pointer",

                            color:
                                "#64748b",
                        }}
                    >
                        ×
                    </button>

                </div>

                {children}

            </div>

        </div>
    );
}