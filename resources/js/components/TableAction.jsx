import {
    Pencil,
    Trash2,
} from "lucide-react";

export default function TableAction({
    onEdit,
    onDelete,
}) {

    return (
        <div
            style={{
                display: "flex",

                gap: "10px",
            }}
        >

            <button
                onClick={onEdit}
                style={{
                    width: "38px",
                    height: "38px",

                    border:
                        "1px solid #e2e8f0",

                    background:
                        "white",

                    borderRadius:
                        "12px",

                    display:
                        "flex",

                    alignItems:
                        "center",

                    justifyContent:
                        "center",

                    cursor:
                        "pointer",
                }}
            >

                <Pencil
                    size={16}
                    color="#6366f1"
                />

            </button>

            <button
                onClick={onDelete}
                style={{
                    width: "38px",
                    height: "38px",

                    border:
                        "1px solid #fee2e2",

                    background:
                        "#fff5f5",

                    borderRadius:
                        "12px",

                    display:
                        "flex",

                    alignItems:
                        "center",

                    justifyContent:
                        "center",

                    cursor:
                        "pointer",
                }}
            >

                <Trash2
                    size={16}
                    color="#ef4444"
                />

            </button>

        </div>
    );
}