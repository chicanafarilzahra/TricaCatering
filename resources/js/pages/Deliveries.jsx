// resources/js/pages/Deliveries.jsx

import AdminLayout from "../layouts/AdminLayout";

import PageHeader from "../components/PageHeader";

import Card from "../components/Card";

import Table from "../components/Table";

import EmptyState from "../components/EmptyState";

export default function Deliveries() {
    return (
        <AdminLayout>
            <PageHeader
                title="Deliveries"
                subtitle="Monitor delivery process and shipment status"
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
                            Delivery List
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
                            Delivery and shipment data
                        </p>
                    </div>
                </div>

                <Table
                    headers={[
                        "Order Code",
                        "Customer",
                        "Courier",
                        "Delivery Date",
                        "Status",
                    ]}
                >
                    {/* BACKEND DATA */}
                </Table>

                <EmptyState
                    title="No Delivery Data"
                    subtitle="Delivery information will appear here"
                />
            </Card>
        </AdminLayout>
    );
}