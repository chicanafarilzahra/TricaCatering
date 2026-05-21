export default function Avatar({
    name,
}) {

    return (
        <div
            style={{
                width: "42px",
                height: "42px",

                borderRadius:
                    "14px",

                background:
                    "linear-gradient(135deg,#6366f1,#8b5cf6)",

                display:
                    "flex",

                alignItems:
                    "center",

                justifyContent:
                    "center",

                color:
                    "white",

                fontWeight:
                    "700",

                fontSize:
                    "15px",
            }}
        >
            {
                name
                    ?.charAt(0)
                    ?.toUpperCase()
            }
        </div>
    );
}