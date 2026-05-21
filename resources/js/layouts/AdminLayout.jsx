// resources/js/layouts/AdminLayout.jsx

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import AppBackground from "../components/AppBackground";

export default function AdminLayout({
    children,
}) {

    return (

        <AppBackground>

            <div
                style={{
                    display: "flex",
                }}
            >

                <Sidebar />

                <div
                    style={{

                        marginLeft: "270px",

                        flex: 1,

                        minHeight: "100vh",
                    }}
                >

                    <Navbar />

                    <div
                        style={{
                            padding: "34px",
                        }}
                    >
                        {children}
                    </div>

                </div>

            </div>

        </AppBackground>
    );
}