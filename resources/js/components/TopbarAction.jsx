export default function TopbarAction({
    children,
}) {

    return (
        <div
            style={{
                display:
                    "flex",

                alignItems:
                    "center",

                gap: "14px",
            }}
        >
            {children}
        </div>
    );
}