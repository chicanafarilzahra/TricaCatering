export default function InfoCard({
    label,
    value,
}) {

    return (
        <div
            style={{
                padding:
                    "18px",

                border:
                    "1px solid #e2e8f0",

                borderRadius:
                    "18px",

                background:
                    "white",
            }}
        >

            <p
                style={{
                    margin: 0,

                    color:
                        "#94a3b8",

                    fontSize:
                        "13px",
                }}
            >
                {label}
            </p>

            <h4
                style={{
                    margin:
                        "10px 0 0",

                    color:
                        "#0f172a",

                    fontSize:
                        "18px",
                }}
            >
                {value}
            </h4>

        </div>
    );
}