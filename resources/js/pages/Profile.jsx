// resources/js/pages/Profile.jsx

import AdminLayout from "../layouts/AdminLayout";

import PageHeader from "../components/PageHeader";

import Card from "../components/Card";

export default function Profile() {
    const user = JSON.parse(
        localStorage.getItem("user")
    );

    return (
        <AdminLayout>
            <PageHeader
                title="Profile"
                subtitle="View your account information"
            />

            <Card>
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "140px 1fr",
                        rowGap: "18px",
                        columnGap: "20px",
                        alignItems: "center",
                    }}
                >
                    <div
                        style={{
                            color: "#94a3b8",
                            fontSize: "14px",
                            fontWeight: "600",
                        }}
                    >
                        Name
                    </div>

                    <div
                        style={{
                            color: "white",
                            fontSize: "15px",
                            fontWeight: "600",
                        }}
                    >
                        {user?.name || "-"}
                    </div>

                    <div
                        style={{
                            color: "#94a3b8",
                            fontSize: "14px",
                            fontWeight: "600",
                        }}
                    >
                        Email
                    </div>

                    <div
                        style={{
                            color: "white",
                            fontSize: "15px",
                            fontWeight: "600",
                        }}
                    >
                        {user?.email || "-"}
                    </div>

                    <div
                        style={{
                            color: "#94a3b8",
                            fontSize: "14px",
                            fontWeight: "600",
                        }}
                    >
                        Role
                    </div>

                    <div
                        style={{
                            display: "inline-flex",
                            width: "fit-content",
                            padding:
                                "6px 12px",
                            borderRadius:
                                "999px",
                            background:
                                "rgba(99,102,241,0.15)",
                            color: "#c4b5fd",
                            fontSize: "13px",
                            fontWeight: "700",
                            textTransform:
                                "capitalize",
                        }}
                    >
                        {user?.role || "-"}
                    </div>
                </div>
            </Card>
        </AdminLayout>
    );
}