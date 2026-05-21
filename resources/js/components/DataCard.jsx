export default function DataCard({
    title,
    value,
    subtitle,
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
            }}
        >

            <p
                style={{
                    margin: 0,

                    color:
                        "#64748b",

                    fontSize:
                        "14px",
                }}
            >
                {title}
            </p>

            <h2
                style={{
                    margin:
                        "12px 0 8px",

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

            <p
                style={{
                    margin: 0,

                    color:
                        "#94a3b8",

                    fontSize:
                        "13px",
                }}
            >
                {subtitle}
            </p>

        </div>
    );
}