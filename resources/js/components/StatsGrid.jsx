export default function StatsGrid({
    children,
}) {

    return (
        <div
            style={{
                display: "grid",

                gridTemplateColumns:
                    "repeat(auto-fit,minmax(240px,1fr))",

                gap: "20px",
            }}
        >
            {children}
        </div>
    );
}   