// resources/js/pages/AuditTrail.jsx

import AdminLayout from "../layouts/AdminLayout";
import PageHeader from "../components/PageHeader";
import Card from "../components/Card";
import Table from "../components/Table";
import EmptyState from "../components/EmptyState";

export default function AuditTrail() {
    return (
        <AdminLayout>
            <PageHeader
                title="Audit Trail"
                subtitle="Track all critical changes made in the system"
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
                            Change History
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
                            Record of updates, deletions,
                            approvals, and important actions
                        </p>
                    </div>
                </div>

                <Table
                    headers={[
                        "User",
                        "Action",
                        "Module",
                        "Date",
                        "Status",
                    ]}
                >
                    {/* BACKEND DATA */}
                </Table>

                <EmptyState
                    title="No Audit Records"
                    subtitle="System change history will appear here"
                />
            </Card>
        </AdminLayout>
    );
}