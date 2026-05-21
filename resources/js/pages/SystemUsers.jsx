// resources/js/pages/SystemUsers.jsx

import AdminLayout from "../layouts/AdminLayout";

import PageHeader from "../components/PageHeader";

import Card from "../components/Card";

import Table from "../components/Table";

import EmptyState from "../components/EmptyState";

export default function SystemUsers() {
    return (
        <AdminLayout>
            <PageHeader
                title="System Users"
                subtitle="Manage all registered users and their roles"
            />

            <Card>
                <div
                    style={{
                        display: "flex",
                        justifyContent:
                            "space-between",
                        alignItems:
                            "center",
                        marginBottom:
                            "24px",
                    }}
                >
                    <div>
                        <h3
                            style={{
                                margin: 0,
                                fontSize:
                                    "20px",
                                fontWeight:
                                    "700",
                                color:
                                    "white",
                            }}
                        >
                            User List
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
                            Owner, Admin, Courier, Client, and SPPG operator accounts
                        </p>
                    </div>
                </div>

                <Table
                    headers={[
                        "Name",
                        "Email",
                        "Role",
                        "Created At",
                        "Status",
                    ]}
                >
                    {/* BACKEND DATA */}
                </Table>

                <EmptyState
                    title="No User Data"
                    subtitle="Registered users will appear here"
                />
            </Card>
        </AdminLayout>
    );
}