import { Search } from "lucide-react";

export default function SearchInput({
    placeholder = "Search...",
    value,
    onChange,
}) {

    return (
        <div
            style={{
                width: "280px",

                height: "48px",

                border:
                    "1px solid #e2e8f0",

                borderRadius:
                    "14px",

                background:
                    "white",

                display:
                    "flex",

                alignItems:
                    "center",

                gap: "10px",

                padding:
                    "0 16px",
            }}
        >

            <Search
                size={18}
                color="#94a3b8"
            />

            <input
                type="text"
                placeholder={
                    placeholder
                }
                value={value}
                onChange={onChange}
                style={{
                    width: "100%",

                    border: "none",

                    outline:
                        "none",

                    background:
                        "transparent",

                    fontSize:
                        "14px",
                }}
            />

        </div>
    );
}