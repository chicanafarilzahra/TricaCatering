// resources/js/pages/Settings.jsx

import AdminLayout from "../layouts/AdminLayout";

import PageHeader from "../components/PageHeader";

import Card from "../components/Card";

export default function Settings() {
    return (
        <AdminLayout>
            <PageHeader
                title="Settings"
                subtitle="Manage application and account preferences"
            />

            <Card>
                <div
                    style={{
                        display: "flex",
                        flexDirection:
                            "column",
                        gap: "20px",
                    }}
                >
                    {/* General Settings */}
                    <div>
                        <h3
                            style={{
                                margin: 0,
                                fontSize:
                                    "20px",
                                fontWeight:
                                    "700",
                                color:
                                    "#ffffff",
                            }}
                        >
                            General Settings
                        </h3>

                        <p
                            style={{
                                margin:
                                    "6px 0 0",
                                fontSize:
                                    "14px",
                                color:
                                    "#94a3b8",
                            }}
                        >
                            Configure application preferences and branding
                        </p>
                    </div>

                    {/* Account Settings */}
                    <div>
                        <h3
                            style={{
                                margin: 0,
                                fontSize:
                                    "20px",
                                fontWeight:
                                    "700",
                                color:
                                    "#ffffff",
                            }}
                        >
                            Account Settings
                        </h3>

                        <p
                            style={{
                                margin:
                                    "6px 0 0",
                                fontSize:
                                    "14px",
                                color:
                                    "#94a3b8",
                            }}
                        >
                            Update your profile, email, and password
                        </p>
                    </div>

                    {/* Security Settings */}
                    <div>
                        <h3
                            style={{
                                margin: 0,
                                fontSize:
                                    "20px",
                                fontWeight:
                                    "700",
                                color:
                                    "#ffffff",
                            }}
                        >
                            Security
                        </h3>

                        <p
                            style={{
                                margin:
                                    "6px 0 0",
                                fontSize:
                                    "14px",
                                color:
                                    "#94a3b8",
                            }}
                        >
                            Manage authentication and access control
                        </p>
                    </div>
                </div>
            </Card>
        </AdminLayout>
    );
}