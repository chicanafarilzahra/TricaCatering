// resources/js/pages/ProductionMonitoring.jsx

import AdminLayout from "../layouts/AdminLayout";
import PageHeader from "../components/PageHeader";
import Card from "../components/Card";
import Table from "../components/Table";
import EmptyState from "../components/EmptyState";

export default function ProductionMonitoring() {
    return (
        <AdminLayout>
            <PageHeader
                title="Production Monitoring"
                subtitle="Monitor food production progress and output"
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
                            Production List
                        </h3>

                        <p
                            style={{
                                margin: "6px 0 0",
                                fontSize: "14px",
                                color: "#94a3b8",
                            }}
                        >
                            Track preparation, cooking, packaging,
                            and completion status for all orders.
                        </p>
                    </div>
                </div>

                <Table
                    headers={[
                        "Order Number",
                        "Package",
                        "Production Stage",
                        "Production Date",
                        "Status",
                    ]}
                >
                    {/* BACKEND DATA */}
                </Table>

                <EmptyState
                    title="No Production Data"
                    subtitle="Production progress data will appear here"
                />
            </Card>
        </AdminLayout>
    );
}