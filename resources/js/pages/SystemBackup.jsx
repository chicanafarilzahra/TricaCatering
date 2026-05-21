// resources/js/pages/SystemBackup.jsx

import AdminLayout from "../layouts/AdminLayout";
import PageHeader from "../components/PageHeader";
import Card from "../components/Card";
import Table from "../components/Table";
import EmptyState from "../components/EmptyState";

export default function SystemBackup() {
    return (
        <AdminLayout>
            <PageHeader
                title="System Backup"
                subtitle="Manage database backups and restore points"
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
                            Backup History
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
                            View all backup files,
                            schedules, and restore
                            points for the system.
                        </p>
                    </div>
                </div>

                <Table
                    headers={[
                        "Backup Name",
                        "Created At",
                        "Size",
                        "Type",
                        "Status",
                    ]}
                >
                    {/* BACKEND DATA */}
                </Table>

                <EmptyState
                    title="No Backup Data"
                    subtitle="System backup records will appear here"
                />
            </Card>
        </AdminLayout>
    );
}