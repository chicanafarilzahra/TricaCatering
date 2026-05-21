// resources/js/pages/Couriers.jsx

import AdminLayout from "../layouts/AdminLayout";

import PageHeader from "../components/PageHeader";

import Card from "../components/Card";

import Table from "../components/Table";

import EmptyState from "../components/EmptyState";

export default function Couriers() {
    return (
        <AdminLayout>
            <PageHeader
                title="Couriers"
                subtitle="Monitor courier data and delivery performance"
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
                            Courier List
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
                            Registered
                            couriers in
                            the system
                        </p>
                    </div>
                </div>

                <Table
                    headers={[
                        "Courier Name",
                        "Phone",
                        "Vehicle",
                        "Status",
                        "Assigned Orders",
                    ]}
                >
                    {/* BACKEND DATA */}
                </Table>

                <EmptyState
                    title="No Courier Data"
                    subtitle="Courier information will appear here"
                />
            </Card>
        </AdminLayout>
    );
}