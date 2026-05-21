export default function FormInput({
    label,
    placeholder,
    type = "text",
    value,
    onChange,
}) {

    return (
        <div
            style={{
                marginBottom:
                    "18px",
            }}
        >

            <label
                style={{
                    display: "block",

                    marginBottom:
                        "8px",

                    fontSize:
                        "14px",

                    fontWeight:
                        "600",

                    color:
                        "#334155",
                }}
            >
                {label}
            </label>

            <input
                type={type}
                placeholder={
                    placeholder
                }
                value={value}
                onChange={onChange}
                style={{
                    width: "100%",

                    height: "50px",

                    border:
                        "1px solid #e2e8f0",

                    borderRadius:
                        "14px",

                    padding:
                        "0 16px",

                    fontSize:
                        "14px",

                    outline:
                        "none",

                    background:
                        "#fff",
                }}
            />

        </div>
    );
}