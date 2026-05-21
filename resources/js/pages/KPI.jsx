// resources/js/pages/KPI.jsx

import AdminLayout from "../layouts/AdminLayout";

import PageHeader from "../components/PageHeader";

import Card from "../components/Card";

import Table from "../components/Table";

import EmptyState from "../components/EmptyState";

export default function KPI() {
    return (
        <AdminLayout>
            <PageHeader
                title="KPI Targets"
                subtitle="Set and monitor business performance indicators"
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
                            KPI Target List
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
                            Business goals and performance targets
                        </p>
                    </div>
                </div>

                <Table
                    headers={[
                        "KPI Name",
                        "Target Value",
                        "Current Value",
                        "Period",
                        "Status",
                    ]}
                >
                    {/* BACKEND DATA */}
                </Table>

                <EmptyState
                    title="No KPI Data"
                    subtitle="KPI targets will appear here"
                />
            </Card>
        </AdminLayout>
    );
}