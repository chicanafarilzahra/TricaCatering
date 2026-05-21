// resources/js/pages/Stocks.jsx

import AdminLayout from "../layouts/AdminLayout";

import PageHeader from "../components/PageHeader";

import Card from "../components/Card";

import Table from "../components/Table";

import EmptyState from "../components/EmptyState";

export default function Stocks() {
    return (
        <AdminLayout>
            <PageHeader
                title="Stocks"
                subtitle="Monitor ingredient stock and inventory levels"
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
                            Stock Inventory
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
                            Current ingredient and raw material stock
                        </p>
                    </div>
                </div>

                <Table
                    headers={[
                        "Ingredient",
                        "Category",
                        "Quantity",
                        "Unit",
                        "Status",
                    ]}
                >
                    {/* BACKEND DATA */}
                </Table>

                <EmptyState
                    title="No Stock Data"
                    subtitle="Inventory data will appear here"
                />
            </Card>
        </AdminLayout>
    );
}