// resources/js/pages/BusinessReports.jsx

import AdminLayout from "../layouts/AdminLayout";
import PageHeader from "../components/PageHeader";
import Card from "../components/Card";
import Table from "../components/Table";
import EmptyState from "../components/EmptyState";

export default function BusinessReports() {
    return (
        <AdminLayout>
            <PageHeader
                title="Business Reports"
                subtitle="Analyze overall business performance and growth"
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
                            Business Performance Reports
                        </h3>

                        <p
                            style={{
                                margin: "6px 0 0",
                                fontSize: "14px",
                                color: "#94a3b8",
                            }}
                        >
                            Revenue trends, order growth,
                            customer analytics, and profitability reports.
                        </p>
                    </div>
                </div>

                <Table
                    headers={[
                        "Report Name",
                        "Period",
                        "Generated At",
                        "Created By",
                        "Status",
                    ]}
                >
                    {/* BACKEND DATA */}
                </Table>

                <EmptyState
                    title="No Business Reports"
                    subtitle="Business report data will appear here"
                />
            </Card>
        </AdminLayout>
    );
}