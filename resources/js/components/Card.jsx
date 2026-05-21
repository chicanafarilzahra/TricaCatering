// resources/js/components/Card.jsx

export default function Card({
    children,
    style = {},
}) {

    return (

        <div
            style={{

                background:
                    `
                    linear-gradient(
                        135deg,
                        rgba(15,23,42,0.9),
                        rgba(17,24,39,0.9)
                    )
                    `,

                border:
                    "1px solid rgba(255,255,255,0.05)",

                borderRadius: "28px",

                padding: "26px",

                backdropFilter:
                    "blur(18px)",

                boxShadow:
                    "0 10px 40px rgba(0,0,0,0.28)",

                ...style,
            }}
        >
            {children}
        </div>
    );
}