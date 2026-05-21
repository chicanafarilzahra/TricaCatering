// resources/js/pages/Orders.jsx

import AdminLayout from "../layouts/AdminLayout";

import PageHeader from "../components/PageHeader";

import Card from "../components/Card";

import Table from "../components/Table";

import EmptyState from "../components/EmptyState";

export default function Orders() {

    return (

        <AdminLayout>

            <PageHeader
                title="Orders"
                subtitle="Manage and monitor customer catering orders"
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
                            Order List
                        </h3>

                        <p
                            style={{
                                margin: "6px 0 0",
                                fontSize: "14px",
                                color: "#94a3b8",
                            }}
                        >
                            Incoming catering orders from customers
                        </p>

                    </div>

                </div>

                <Table
                    headers={[
                        "Customer",
                        "Package",
                        "Order Date",
                        "Status",
                        "Total",
                    ]}
                >

                    {/* DATA BACKEND */}

                </Table>

                <EmptyState
                    title="No Orders Found"
                    subtitle="Customer orders will appear here"
                />

            </Card>

        </AdminLayout>

    );

}