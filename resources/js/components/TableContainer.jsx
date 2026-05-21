// resources/js/components/TableContainer.jsx

export default function TableContainer({
    children,
}) {

    return (

        <div
            style={{

                overflowX:
                    "auto",

                borderRadius:
                    "22px",

                border:
                    "1px solid rgba(255,255,255,0.05)",

                background:
                    "rgba(255,255,255,0.03)",
            }}
        >
            {children}
        </div>
    );
}