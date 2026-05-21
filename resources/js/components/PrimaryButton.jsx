export default function PrimaryButton({
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

                border: "none",

                borderRadius:
                    "14px",

                background:
                    "linear-gradient(135deg,#6366f1,#8b5cf6)",

                color: "white",

                fontWeight:
                    "600",

                fontSize:
                    "14px",

                cursor:
                    "pointer",

                boxShadow:
                    "0 10px 20px rgba(99,102,241,0.18)",
            }}
        >
            {children}
        </button>
    );
}