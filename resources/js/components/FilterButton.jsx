import { SlidersHorizontal } from "lucide-react";

export default function FilterButton({
    onClick,
}) {

    return (
        <button
            onClick={onClick}
            style={{
                height: "48px",

                padding:
                    "0 18px",

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

                cursor:
                    "pointer",

                fontWeight:
                    "600",

                color:
                    "#334155",
            }}
        >

            <SlidersHorizontal
                size={18}
            />

            Filter

        </button>
    );
}