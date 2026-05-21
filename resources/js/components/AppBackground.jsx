// resources/js/components/AppBackground.jsx

export default function AppBackground({
    children,
}) {

    return (

        <div
            style={{

                minHeight: "100vh",

                background:
                    `
                    radial-gradient(
                        circle at top left,
                        rgba(99,102,241,0.15),
                        transparent 25%
                    ),

                    radial-gradient(
                        circle at bottom right,
                        rgba(139,92,246,0.12),
                        transparent 25%
                    ),

                    #020617
                    `,

                overflow: "hidden",
            }}
        >
            {children}
        </div>
    );
}