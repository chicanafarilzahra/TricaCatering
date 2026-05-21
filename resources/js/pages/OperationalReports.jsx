// resources/js/pages/OperationalReports.jsx

import AdminLayout from "../layouts/AdminLayout";
import PageHeader from "../components/PageHeader";
import Card from "../components/Card";
import Table from "../components/Table";
import EmptyState from "../components/EmptyState";

export default function OperationalReports() {
    return (
        <AdminLayout>
            <PageHeader
                title="Operational Reports"
                subtitle="Monitor daily operational activities and performance"
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
                            Operational Report List
                        </h3>

                        <p
                            style={{
                                margin: "6px 0 0",
                                fontSize: "14px",
                                color: "#94a3b8",
                            }}
                        >
                            Daily summaries of orders, production,
                            deliveries, and stock usage.
                        </p>
                    </div>
                </div>

                <Table
                    headers={[
                        "Report Date",
                        "Total Orders",
                        "Production Output",
                        "Deliveries",
                        "Status",
                    ]}
                >
                    {/* BACKEND DATA */}
                </Table>

                <EmptyState
                    title="No Operational Reports"
                    subtitle="Operational report data will appear here"
                />
            </Card>
        </AdminLayout>
    );
}