// resources/js/pages/SystemHealth.jsx

import AdminLayout from "../layouts/AdminLayout";
import PageHeader from "../components/PageHeader";
import Card from "../components/Card";
import Table from "../components/Table";
import EmptyState from "../components/EmptyState";

export default function SystemHealth() {
    return (
        <AdminLayout>
            <PageHeader
                title="System Health"
                subtitle="Monitor server performance and application status"
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
                            Server Status
                        </h3>

                        <p
                            style={{
                                margin: "6px 0 0",
                                fontSize: "14px",
                                color: "#94a3b8",
                            }}
                        >
                            Track CPU usage, memory, storage,
                            and application uptime.
                        </p>
                    </div>
                </div>

                <Table
                    headers={[
                        "Metric",
                        "Current Value",
                        "Threshold",
                        "Last Checked",
                        "Status",
                    ]}
                >
                    {/* BACKEND DATA */}
                </Table>

                <EmptyState
                    title="No System Data"
                    subtitle="System performance metrics will appear here"
                />
            </Card>
        </AdminLayout>
    );
}