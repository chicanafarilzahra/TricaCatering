export default function ChartCard({
    title,
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
                    "24px",

                padding:
                    "24px",
            }}
        >

            <h3
                style={{
                    marginTop: 0,

                    marginBottom:
                        "20px",

                    fontSize:
                        "18px",

                    color:
                        "#0f172a",
                }}
            >
                {title}
            </h3>

            {children}

        </div>
    );
}