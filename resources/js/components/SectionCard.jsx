export default function SectionCard({
    title,
    subtitle,
    children,
}) {

    return (
        <div
            style={{
                background:
                    "white",

                border:
                    "1px solid #e2e8f0",

                borderRadius:
                    "28px",

                padding:
                    "24px",
            }}
        >

            <div
                style={{
                    marginBottom:
                        "24px",
                }}
            >

                <h3
                    style={{
                        margin: 0,

                        fontSize:
                            "18px",

                        color:
                            "#0f172a",
                    }}
                >
                    {title}
                </h3>

                <p
                    style={{
                        margin:
                            "6px 0 0",

                        color:
                            "#64748b",

                        fontSize:
                            "14px",
                    }}
                >
                    {subtitle}
                </p>

            </div>

            {children}

        </div>
    );
}