// resources/js/pages/Productions.jsx

import AdminLayout from "../layouts/AdminLayout";

import PageHeader from "../components/PageHeader";

import Card from "../components/Card";

import Table from "../components/Table";

import EmptyState from "../components/EmptyState";

export default function Productions() {

    return (

        <AdminLayout>

            <PageHeader
                title="Productions"
                subtitle="Monitor catering production activities"
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
                                color: "#ffffff",
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
                            Catering production monitoring
                        </p>

                    </div>

                </div>

                <Table
                    headers={[
                        "Production Code",
                        "Package",
                        "Quantity",
                        "Production Date",
                        "Status",
                    ]}
                >

                    {/* DATA BACKEND */}

                </Table>

                <EmptyState
                    title="No Production Data"
                    subtitle="Production activity will appear here"
                />

            </Card>

        </AdminLayout>

    );

}