export default function GlassCard({
    children,
}) {

    return (
        <div
            style={{
                background:
                    "rgba(255,255,255,0.7)",

                backdropFilter:
                    "blur(18px)",

                border:
                    "1px solid rgba(255,255,255,0.4)",

                borderRadius:
                    "28px",

                padding:
                    "24px",

                boxShadow:
                    "0 10px 40px rgba(0,0,0,0.05)",
            }}
        >
            {children}
        </div>
    );
}