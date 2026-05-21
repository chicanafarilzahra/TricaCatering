// resources/js/pages/RoleManagement.jsx

import AdminLayout from "../layouts/AdminLayout";
import PageHeader from "../components/PageHeader";
import Card from "../components/Card";
import Table from "../components/Table";
import EmptyState from "../components/EmptyState";

export default function RoleManagement() {
    return (
        <AdminLayout>
            <PageHeader
                title="Role Management"
                subtitle="Manage user roles and access permissions"
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
                            Role List
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
                            Configure access rights for
                            Owner, Admin, Courier,
                            Client, and SPPG users
                        </p>
                    </div>
                </div>

                <Table
                    headers={[
                        "Role Name",
                        "Description",
                        "Total Users",
                        "Permissions",
                        "Status",
                    ]}
                >
                    {/* BACKEND DATA */}
                </Table>

                <EmptyState
                    title="No Role Data"
                    subtitle="User roles and permissions will appear here"
                />
            </Card>
        </AdminLayout>
    );
}