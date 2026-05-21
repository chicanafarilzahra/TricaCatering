// resources/js/pages/PermissionSettings.jsx

import AdminLayout from "../layouts/AdminLayout";
import PageHeader from "../components/PageHeader";
import Card from "../components/Card";
import Table from "../components/Table";
import EmptyState from "../components/EmptyState";

export default function PermissionSettings() {
    return (
        <AdminLayout>
            <PageHeader
                title="Permission Settings"
                subtitle="Configure detailed access permissions for each role"
            />

            <Card>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "24px",
                    }}
                >
                    <div>
                        <h3
                            style={{
                                margin: 0,
                                fontSize: "20px",
                                fontWeight: "700",
                                color: "white",
                            }}
                        >
                            Permission Matrix
                        </h3>

                        <p
                            style={{
                                margin: "6px 0 0",
                                fontSize: "14px",
                                color: "#94a3b8",
                            }}
                        >
                            Manage module permissions such as
                            create, view, update, and delete
                            for every system role.
                        </p>
                    </div>
                </div>

                <Table
                    headers={[
                        "Role",
                        "Module",
                        "View",
                        "Create",
                        "Update",
                        "Delete",
                    ]}
                >
                    {/* BACKEND DATA */}
                </Table>

                <EmptyState
                    title="No Permission Data"
                    subtitle="Permission configuration will appear here"
                />
            </Card>
        </AdminLayout>
    );
}