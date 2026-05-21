export default function SectionTitle({
    title,
    subtitle,
}) {

    return (
        <div
            style={{
                marginBottom:
                    "20px",
            }}
        >

            <h2
                style={{
                    margin: 0,

                    fontSize:
                        "20px",

                    color:
                        "#0f172a",

                    fontWeight:
                        "700",
                }}
            >
                {title}
            </h2>

            <p
                style={{
                    marginTop:
                        "6px",

                    color:
                        "#64748b",

                    fontSize:
                        "14px",
                }}
            >
                {subtitle}
            </p>

        </div>
    );
}