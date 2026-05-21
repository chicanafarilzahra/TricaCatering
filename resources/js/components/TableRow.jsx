export default function TableRow({
    children,
}) {

    return (
        <tr
            style={{
                borderBottom:
                    "1px solid #f1f5f9",
            }}
        >
            {children}
        </tr>
    );
}