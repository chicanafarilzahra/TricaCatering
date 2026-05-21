// resources/js/components/EmptyState.jsx

import {
    Inbox,
} from "lucide-react";

export default function EmptyState({
    title = "No Data",
    description = "There is no data available yet.",
}) {

    return (

        <div
            style={{

                padding:
                    "70px 20px",

                textAlign:
                    "center",
            }}
        >

            <div
                style={{

                    width: "74px",

                    height: "74px",

                    borderRadius:
                        "22px",

                    background:
                        "rgba(99,102,241,0.12)",

                    display: "flex",

                    alignItems:
                        "center",

                    justifyContent:
                        "center",

                    margin:
                        "0 auto 22px",
                }}
            >

                <Inbox
                    size={34}
                    color="#6366f1"
                />

            </div>

            <h2
                style={{
                    color: "white",

                    fontSize: "20px",

                    marginBottom: "10px",
                }}
            >
                {title}
            </h2>

            <p
                style={{
                    color: "#94a3b8",

                    fontSize: "14px",
                }}
            >
                {description}
            </p>

        </div>
    );
}