import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function AdminLayout({
    children,
}) {
    return (
        <div
            style={{
                display: "flex",
                minHeight: "100vh",
                background:
                    "linear-gradient(180deg,#020617,#071028)",
                overflow: "hidden",
            }}
        >
            <Sidebar />

            <div
                style={{
                    flex: 1,
                    marginLeft: "270px",
                    minWidth: 0,
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <Navbar />

                <main
                    style={{
                        flex: 1,
                        padding: "28px",
                        overflowY: "auto",
                        overflowX: "hidden",
                        color: "white",
                    }}
                >
                    {children}
                </main>
            </div>
        </div>
    );
}