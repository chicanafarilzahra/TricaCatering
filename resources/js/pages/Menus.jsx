// resources/js/pages/Menus.jsx

import AdminLayout from "../layouts/AdminLayout";

import PageHeader from "../components/PageHeader";

import Card from "../components/Card";

import Table from "../components/Table";

import EmptyState from "../components/EmptyState";

export default function Menus() {

    return (

        <AdminLayout>

            <PageHeader
                title="Menus"
                subtitle="Manage catering food and beverage menus"
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
                            Menu List
                        </h3>

                        <p
                            style={{
                                margin: "6px 0 0",
                                fontSize: "14px",
                                color: "#94a3b8",
                            }}
                        >
                            Available catering menus
                        </p>

                    </div>

                </div>

                <Table
                    headers={[
                        "Menu Name",
                        "Category",
                        "Price",
                        "Stock",
                        "Status",
                    ]}
                >

                    {/* DATA BACKEND */}

                </Table>

                <EmptyState
                    title="No Menus Found"
                    subtitle="Menu data will appear here"
                />

            </Card>

        </AdminLayout>

    );

}