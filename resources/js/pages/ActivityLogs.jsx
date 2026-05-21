// resources/js/pages/ActivityLogs.jsx

import AdminLayout from "../layouts/AdminLayout";

import PageHeader from "../components/PageHeader";

import Card from "../components/Card";

import Table from "../components/Table";

import EmptyState from "../components/EmptyState";

export default function ActivityLogs() {
    return (
        <AdminLayout>
            <PageHeader
                title="Activity Logs"
                subtitle="Track all important system activities and user actions"
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
                            System Activity Logs
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
                            Login history, updates, and operational activities
                        </p>
                    </div>
                </div>

                <Table
                    headers={[
                        "User",
                        "Activity",
                        "Module",
                        "Date & Time",
                        "Status",
                    ]}
                >
                    {/* BACKEND DATA */}
                </Table>

                <EmptyState
                    title="No Activity Logs"
                    subtitle="System activities will appear here"
                />
            </Card>
        </AdminLayout>
    );
}