export default function StatCard({
    title,
    value,
    icon,
}) {

    return (
        <div
            style={{
                background:
                    "rgba(255,255,255,0.9)",

                backdropFilter:
                    "blur(18px)",

                border:
                    "1px solid rgba(255,255,255,0.5)",

                borderRadius:
                    "28px",

                padding:
                    "24px",

                display:
                    "flex",

                alignItems:
                    "center",

                justifyContent:
                    "space-between",

                boxShadow:
                    "0 10px 40px rgba(15,23,42,0.05)",
            }}
        >

            <div>

                <p
                    style={{
                        margin: 0,

                        fontSize:
                            "14px",

                        color:
                            "#64748b",
                    }}
                >
                    {title}
                </p>

                <h2
                    style={{
                        margin:
                            "10px 0 0",

                        fontSize:
                            "34px",

                        color:
                            "#0f172a",

                        fontWeight:
                            "700",
                    }}
                >
                    {value}
                </h2>

            </div>

            <div
                style={{
                    width: "58px",
                    height: "58px",

                    borderRadius:
                        "20px",

                    background:
                        "#eef2ff",

                    display:
                        "flex",

                    alignItems:
                        "center",

                    justifyContent:
                        "center",
                }}
            >
                {icon}
            </div>

        </div>
    );
}