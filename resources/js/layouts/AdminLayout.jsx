import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function AdminLayout({
    children,
}) {
    return (
        <div
            style={{
                position: "fixed",
                inset: 0,
                display: "flex",
                overflow: "hidden",
                background: "#071028",
            }}
        >
            {/* SIDEBAR */}
            <div
                style={{
                    width: "285px",
                    height: "100%",
                    flexShrink: 0,
                }}
            >
                <Sidebar />
            </div>

            {/* MAIN */}
            <div
                style={{
                    flex: 1,
                    minWidth: 0,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden",
                    background: "#071028",
                }}
            >
                {/* NAVBAR */}
                <div
                    style={{
                        width: "100%",
                        flexShrink: 0,
                    }}
                >
                    <Navbar />
                </div>

                {/* CONTENT */}
                <main
                    style={{
                        flex: 1,
                        overflowY: "auto",
                        overflowX: "hidden",
                        padding: "24px",
                        background: "#071028",
                        color: "#fff",
                    }}
                >
                    {children}
                </main>
            </div>
        </div>
    );
}