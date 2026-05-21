export default function SecondaryButton({
    children,
    onClick,
    type = "button",
}) {

    return (
        <button
            type={type}
            onClick={onClick}
            style={{
                height: "46px",

                padding:
                    "0 18px",

                border:
                    "1px solid #e2e8f0",

                borderRadius:
                    "14px",

                background:
                    "white",

                color: "#0f172a",

                fontWeight:
                    "600",

                fontSize:
                    "14px",

                cursor:
                    "pointer",
            }}
        >
            {children}
        </button>
    );
}