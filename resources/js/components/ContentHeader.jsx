export default function ContentHeader({
    children,
}) {

    return (
        <div
            style={{
                display: "flex",

                justifyContent:
                    "space-between",

                alignItems:
                    "center",

                marginBottom:
                    "22px",
            }}
        >
            {children}
        </div>
    );
}