export default function FormSelect({
    label,
    value,
    onChange,
    options = [],
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

            <select
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
            >

                {options.map(
                    (
                        option,
                        index
                    ) => (
                        <option
                            key={index}
                            value={
                                option.value
                            }
                        >
                            {option.label}
                        </option>
                    )
                )}

            </select>

        </div>
    );
}