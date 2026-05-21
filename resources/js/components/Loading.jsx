export default function Loading() {

    return (
        <div
            style={{
                height: "300px",

                display: "flex",

                alignItems:
                    "center",

                justifyContent:
                    "center",
            }}
        >

            <div
                style={{
                    width: "48px",
                    height: "48px",

                    border:
                        "5px solid #e2e8f0",

                    borderTop:
                        "5px solid #6366f1",

                    borderRadius:
                        "999px",

                    animation:
                        "spin 1s linear infinite",
                }}
            />

            <style>
                {`
                    @keyframes spin {
                        from {
                            transform: rotate(0deg);
                        }

                        to {
                            transform: rotate(360deg);
                        }
                    }
                `}
            </style>

        </div>
    );
}