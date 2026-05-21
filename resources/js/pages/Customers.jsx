// resources/js/pages/Customers.jsx

import AdminLayout from "../layouts/AdminLayout";

import PageHeader from "../components/PageHeader";

import Card from "../components/Card";

import Table from "../components/Table";

import EmptyState from "../components/EmptyState";

export default function Customers() {
    return (
        <AdminLayout>
            <PageHeader
                title="Customers"
                subtitle="Monitor customer data and order activity"
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
                            Customer List
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
                            Registered customers in the system
                        </p>
                    </div>
                </div>

                <Table
                    headers={[
                        "Customer Name",
                        "Email",
                        "Phone",
                        "Total Orders",
                        "Status",
                    ]}
                >
                    {/* BACKEND DATA */}
                </Table>

                <EmptyState
                    title="No Customer Data"
                    subtitle="Customer information will appear here"
                />
            </Card>
        </AdminLayout>
    );
}