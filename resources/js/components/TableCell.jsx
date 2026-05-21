export default function TableCell({
    children,
}) {

    return (
        <td
            style={{
                padding:
                    "18px 0",

                fontSize:
                    "14px",

                color:
                    "#334155",
            }}
        >
            {children}
        </td>
    );
}