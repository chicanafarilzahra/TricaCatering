// resources/js/pages/Reports.jsx

import AdminLayout from "../layouts/AdminLayout";

import PageHeader from "../components/PageHeader";

import Card from "../components/Card";

import Table from "../components/Table";

import EmptyState from "../components/EmptyState";

export default function Reports() {
    return (
        <AdminLayout>
            <PageHeader
                title="Reports"
                subtitle="View business and operational reports"
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
                            Report List
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
                            Financial, operational, and business reports
                        </p>
                    </div>
                </div>

                <Table
                    headers={[
                        "Report Name",
                        "Period",
                        "Created By",
                        "Created At",
                        "Status",
                    ]}
                >
                    {/* BACKEND DATA */}
                </Table>

                <EmptyState
                    title="No Reports Available"
                    subtitle="Generated reports will appear here"
                />
            </Card>
        </AdminLayout>
    );
}