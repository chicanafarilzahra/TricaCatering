export default function Table({
    headers = [],
    children,
}) {

    return (
        <div
            style={{
                overflowX:
                    "auto",
            }}
        >

            <table
                width="100%"
                style={{
                    borderCollapse:
                        "collapse",
                }}
            >

                <thead>

                    <tr
                        style={{
                            borderBottom:
                                "1px solid #e2e8f0",

                            textAlign:
                                "left",
                        }}
                    >

                        {headers.map(
                            (
                                header,
                                index
                            ) => (
                                <th
                                    key={index}
                                    style={{
                                        padding:
                                            "16px 0",

                                        fontSize:
                                            "13px",

                                        color:
                                            "#64748b",

                                        fontWeight:
                                            "600",
                                    }}
                                >
                                    {header}
                                </th>
                            )
                        )}

                    </tr>

                </thead>

                <tbody>
                    {children}
                </tbody>

            </table>

        </div>
    );
}