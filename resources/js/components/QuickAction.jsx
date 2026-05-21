export default function QuickAction({
    icon,
    title,
    subtitle,
    onClick,
}) {

    return (
        <button
            onClick={onClick}
            style={{
                width: "100%",

                border: "none",

                background:
                    "white",

                borderRadius:
                    "24px",

                padding:
                    "22px",

                textAlign:
                    "left",

                cursor:
                    "pointer",

                border:
                    "1px solid #e2e8f0",

                transition:
                    "0.2s",
            }}
        >

            <div
                style={{
                    width: "54px",
                    height: "54px",

                    borderRadius:
                        "18px",

                    background:
                        "#eef2ff",

                    display:
                        "flex",

                    alignItems:
                        "center",

                    justifyContent:
                        "center",

                    marginBottom:
                        "18px",
                }}
            >
                {icon}
            </div>

            <h3
                style={{
                    margin: 0,

                    fontSize:
                        "17px",

                    color:
                        "#0f172a",
                }}
            >
                {title}
            </h3>

            <p
                style={{
                    margin:
                        "7px 0 0",

                    color:
                        "#64748b",

                    fontSize:
                        "14px",
                }}
            >
                {subtitle}
            </p>

        </button>
    );
}