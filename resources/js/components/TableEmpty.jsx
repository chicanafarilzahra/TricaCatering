export default function TableEmpty({
    title = "No Data",
}) {

    return (
        <tr>

            <td
                colSpan="100%"
                style={{
                    padding:
                        "40px 0",

                    textAlign:
                        "center",

                    color:
                        "#94a3b8",

                    fontSize:
                        "14px",
                }}
            >
                {title}
            </td>

        </tr>
    );
}