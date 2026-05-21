// resources/js/components/StatusBadge.jsx

export default function StatusBadge({
    status,
}) {

    const styles = {

        pending: {
            background:
                "rgba(251,191,36,0.15)",
            color: "#fbbf24",
        },

        approved: {
            background:
                "rgba(59,130,246,0.15)",
            color: "#3b82f6",
        },

        production: {
            background:
                "rgba(168,85,247,0.15)",
            color: "#a855f7",
        },

        delivery: {
            background:
                "rgba(99,102,241,0.15)",
            color: "#6366f1",
        },

        completed: {
            background:
                "rgba(34,197,94,0.15)",
            color: "#22c55e",
        },

        rejected: {
            background:
                "rgba(239,68,68,0.15)",
            color: "#ef4444",
        },
    };

    const current =
        styles[
            status?.toLowerCase()
        ] || styles.pending;

    return (

        <div
            style={{

                width: "fit-content",

                padding:
                    "8px 14px",

                borderRadius:
                    "999px",

                fontSize: "12px",

                fontWeight: "600",

                textTransform:
                    "capitalize",

                background:
                    current.background,

                color:
                    current.color,
            }}
        >
            {status}
        </div>
    );
}