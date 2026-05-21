// resources/js/components/PageHeader.jsx

export default function PageHeader({
    title,
    description,
    action,
}) {

    return (

        <div
            style={{

                display: "flex",

                alignItems: "center",

                justifyContent:
                    "space-between",

                marginBottom: "28px",
            }}
        >

            <div>

                <h1
                    style={{
                        color: "white",

                        fontSize: "30px",

                        fontWeight: "700",

                        margin: 0,

                        letterSpacing:
                            "-0.6px",
                    }}
                >
                    {title}
                </h1>

                <p
                    style={{
                        color: "#94a3b8",

                        marginTop: "8px",

                        fontSize: "14px",
                    }}
                >
                    {description}
                </p>

            </div>

            {action}

        </div>
    );
}