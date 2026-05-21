export default function Grid({
    children,
}) {

    return (
        <div
            style={{
                display: "grid",

                gridTemplateColumns:
                    "repeat(auto-fit,minmax(280px,1fr))",

                gap: "20px",
            }}
        >
            {children}
        </div>
    );
}