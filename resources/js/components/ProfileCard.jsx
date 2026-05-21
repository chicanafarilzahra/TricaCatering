export default function ProfileCard({
    name,
    role,
}) {

    return (
        <div
            style={{
                background:
                    "white",

                border:
                    "1px solid #e2e8f0",

                borderRadius:
                    "24px",

                padding:
                    "24px",

                display:
                    "flex",

                alignItems:
                    "center",

                gap: "18px",
            }}
        >

            <div
                style={{
                    width: "62px",
                    height: "62px",

                    borderRadius:
                        "20px",

                    background:
                        "linear-gradient(135deg,#6366f1,#8b5cf6)",

                    display:
                        "flex",

                    alignItems:
                        "center",

                    justifyContent:
                        "center",

                    color:
                        "white",

                    fontWeight:
                        "700",

                    fontSize:
                        "22px",
                }}
            >
                {
                    name
                        ?.charAt(0)
                        ?.toUpperCase()
                }
            </div>

            <div>

                <h3
                    style={{
                        margin: 0,

                        color:
                            "#0f172a",

                        fontSize:
                            "18px",
                    }}
                >
                    {name}
                </h3>

                <p
                    style={{
                        margin:
                            "6px 0 0",

                        color:
                            "#64748b",

                        fontSize:
                            "14px",

                        textTransform:
                            "capitalize",
                    }}
                >
                    {role}
                </p>

            </div>

        </div>
    );
}